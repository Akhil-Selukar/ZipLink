<div align="center">
  <h1>
    ZipLink (High Level Architecture)
  </h1>
</div>
<hr>

<h3 align="center"> Requirements </h3>

### Functional requirements:<br>

- Given a long url system should generate a short url and return it to user.
- When triggered a short url it should open (redirect to) the original long url.
- User should be able to register themself (craete new user account).
- User should be able to login to access urls created by them.
- User should be able to see analytics of url's created by them.

### Non functional requirements:<br>

- Uniqueness. (No two long urls should have same short url)
- Redirect should be very fast.
- System should handle large traffic and suddern traffic spikes.
- System should be highly available.
<hr>

<h3 align="center"> Entities </h3>

Here we are providing user signup functionality so we need to store user details in database, for this we will need `user` entity. <br>Also when a user creates a short url, we need to store the correct mapping of short url with it's corresponding long url hence we will need a `mapping` entity.<br>
Apart from user and shortning of url's, we are implementing analytics functionality to check analytics as well so we need to store every redirection (i.e. every time a short url is used) we need to store that data, so that we can provide analytics based on the stored data. (Here analytics is not the main focus hence I will only implement basics analytics like total click count per url.)

> below are the raw entity structures, based on requirements during implementation based on requirements we can add additional fields.

<table width="100%" border="0" cellpadding="0" cellspacing="0">
  <tr>
    <td width="50%">
      <h4 align="center">User</h4>
      - id<br>
      - name<br>
      - email<br>
      - password<br>
      - createdAt
    </td>
    <td width="50%">
      <h4 align="center">Mapping</h4>
      - id<br>
      - userId<br>
      - shortUrl<br>
      - longUrl<br>
      - createdAt<br>
    </td>
 </tr>
</table>
<table width="100%" border="0" cellpadding="0" cellspacing="0">
<tr>
 <td width="50%">
      <h4 align="center">ClickEvent</h4>
      - id<br>
      - userId<br>
      - shortUrl<br>
      - timeStamp<br>
      - createdAt
    </td>
    <td width="50%">
      <h4 align="center"></h4>
    </td>
 </tr>
</table>

<hr>
<h3 align="center"> API's and Scale of application </h3>
If we consider 100 million total daily active users(DAU), most of the requests will be for redirection. As one single short url created by a user can be shared with 1000's of other people and they can click on it. So generation to redirection ratio will be 1:1000. Which makes 100 thousand url generation request per 100 million DAU (i.e. 0.1%). For estimates even if we consider 1% of daily traffic as new url generation request then as well the system is extensively ready heavy system. So database need to optimize for faster reads.

<br> 
To implement this project below are the essential API's that has to be implemented.<br>

#### 1. User creation - API to create a new user<br>

HTTP method : POST <br>
Endpoint : /user/create <br>
Request body :

```json
{
    name: String
    email: String
    password: String
}
```

Response : 200-OK<br>

#### 2. Login - API for user to login to their account <br>

HTTP method : POST <br>
Endpoint : /auth/login <br>
Request body :

```json
{
    email: String
    password: String
}
```

Response : 200-OK with tooken or 401-UNAUTHORIZED<br>

#### 3.Url creation - API to create short urls <br>

HTTP method : POST <br>
Endpoint : /url <br>
Request body :

```json
{
    longUrl: String
}
```

Response : 201-CREATED with short url<br>

#### 4. Redirection API - API to redirect to original ling url

HTTP method : GET<br>
Endpoint : /{shorturl}<br>
Response : 302-REDIRECT

> Here I'm not using 301 REDIRECT (which is permanent redirect). In case of permanent redirect the browser store the response in browser cache and in subsequent request for same url form same browser it serves the request from internal browser cache instead of requesting it from backend. But as we need to implement analytics, we need each request to reach the backend servers so that it can be tracked. Hence I'm using 302 i.e. temporary redirect.)

#### 5. Analytics API - API to fetch analytics for all urls created by logged in user<br>

HTTP method : GET<br>
Endpoint : /analytisc<br>
Response : 200-OK with list of all url's and it's click count.

<hr>
<h3 align="center"> High Level Architecture </h3>
<img align="center" src="images\High-level-architecture.png" alt="ZipLink High Level Architecture Diagram" />

Here as we require to ensure scalability and we know that the load of every service is not evenly distributed i.r. redirection will have very high load, new url creation and login might experience moderate while new user creation and analytics service might not experience that much of a load. So better option here is to go with microservices architecture.

Any request generated from browser be it for user creation, redirection, url creation or anything, first will go through the API gateway. The benefits of using API gateway are, it provides features like load balancing, SSL termination, rate limiting, it also handle authentication of JWT tokens using public key along with it's main purpose of routing the requests to appropriate service and client does not need to directly communicate with every single endpoint in backend.

The first operation in the short url generation flow is to create an user account. So user sign-up (i.e new user creation) will be the first flow in the application. we are handling user related operations in user service. Even though sigh-up and login functionalities feel very related, it might sound a wise decision to combine them in one service. But user service is the one which deals with everything related to user like user creation, modifications in user profile, deletion of user, etc. While auth service typically handle operations like validating credentials, generation of token, logout, password reset, etc. So user service will handle the new user creation requests.
<br>Here as the structure of User entity is well defined i.e. name, email and password, if required we can add other fields as well but the structure is defined so a traditional SQL database like MySQL will work perfectly here. (This database will also work perfectly for mappigs and click events as there as well we have a well defined structure for each record).

Next step after creation of user is to login to user account, for this the system need to authenticate the user with email id and password. Hence we have added a Auth service in system. This service will verify user credentials against the database and in case of valid credentials it will generate a JWT token and return it to front end. This token will be verified for all further requests from the user.

Once authenticated, the user need to create a short url using the Url creation API. So we are using Url service to implement this functionality. Once logged in user can create multiple url's using this service. This service will accept a long url as part of request body for url creation API, it will generate an unique id for that url and then store the mapping of unique id against the provided long url in database (i.e. mapping entity). Here unique id generation is one very important part which is discussed further. Once the id is generated and mapping is saved in database, the short url (i.e. the unique id with domain name) is shared to user.

Till this point we have covered half of the application flow, now consider any other person tries to access the short url i.e. `https://domain.com/abcd123pqr`. Here the main part is `abcd123pqr` (i.e. the unique id) which is stored in database and against which the long url is present where this request should be redirected. This request will be the one which is mostly received by the system. So a separate redirection service is the best choice for this. As estimated earlier there will be around 99 million requests per day, so even if the requests are distributed evenly throughout the day, per second there will be 1000-1500 requests, so this service might need scaling based on load.<br>
Here as soon as request is received at the backend, the unique id will be picked up as the url parameter, this unique id will be checked against the database and it's corresponding long url will be fetched. Then as we need to track all redirection requests for analysis, before returning the response to user we have to store this request/click event in databse. Once the click event is stored then a 302 redirect will be returned to the frontend with original long url, so that broweser can display the original page.

Analytics service will simply read data from clickEvent table and return the aggregated result to display analytics.

Now the most important part of the system i.e. performance tuning and NFR's.<br>

The most important non functional requirement is the uniqueness of short url. Every single short url has to be unique.<br>
One simple solution to this is we can just generate a hash value of the given long url and take a substring out of it. This will give us short value but there can be collisions. I mean it might happen that the substring which we are taking from the generated hash value is same for different url's, so this is not a good strategy to use.<br>
Another way to generate a short unique id is to keep an atomic counter in data base or redis and use value of the counter as short unique id. For every new requiest we need to keep incrementing the counter.
This will work but the problem here is with scale. Because with every new request we need to check with either DB or redis and get the new value, after generating the url we need to make sure new updated counter value is committed as well, and in case of restart we will need to make sure we skip all the already used counter values and set the counter to correct value before serving any new request. So for smaller workload this solution will definitely work but it will fail with scale.<br>
The best solution here is snowflake id. Snowflake id generation is an algorithm which allow us to generate around 4000 unique id's per server per millisecond, so this will definitely handle the scale. Also some benefits of using snowflake id are, these id's guarantee uniqueness across servers and the id's are by default sorted in ascending order. Apart from scale and uniqueness, even though the Id's are in sorted order but it is practically not possible to guess next id like in atomic counter where we can simply increment the id by 1 and access next url, so this strategy will be more secure as well.

Now talking about response time and bottlenecks in the system, we know that we have 1000 times more redirect request then new data url creation requests. So if we keep on scaning the entire mapping table for fetching the long url against the short url this will be a time consuming process and serving 1000-1500 requests per second will definitely create a bottleneck here. Another bottleneck will be the operation of storing click event data before returning the redirect response to browser. This click event storing is completely unrelated to user, So spending few milliseconds to do something which is not necessary to return redirect response is not a wise choice.<br>

To solve these two issues and improve redirection response time we can do few things like use redis cache in redirection flow. That means before going to databse for long url mapping we can first check redis and if redis has the mapping cached then we can avoid the database call entirely for that request and serve the user from redis. This will reduce the load on databse significantly, also redis is much faster than a database call so response time will also be improved. In redis we can store top 10 million frequently acessed urls and refresh the data using LRU (least recently used) strategy.<br>

Another thing we can do to further reduce load on databse is to use database sharding. Here sharding key is an important thing to pay attention to. Rather than using user name or geographic location of the user to shard the database we can use unique id itself as the sharding key. We know that the snowflake id's are sorted so we can simply use that id to calculate in which database shard the entry should go, same we can do while read operation as well. By using the unique id we can calculate in which shard the entry must be present. This will ensure two things, one is the distribution of load will be uniform across shards and there will not be any hotspots, and another is it will reduce the load on database inturn improving the response time.

Now to solve another bottlenect of storing clickevent in database before returning the redirect to user, instead of calling the database save operation right from redirection service we can simply publish the click event in a kafka queue. Then a kafka consumer can read message from that queue and store in the database. This simply eliminate the database call form redirection service and we can publish the events in kafka asynchronously in batches as the event publication does not affect redirect operation on user's screen. So redirection service will not have to wait for click event to be processed before returning the response.
