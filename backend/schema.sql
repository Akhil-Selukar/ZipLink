-- ==================================
-- Database schema to load in MySQL
-- ==================================
create database if not exists ziplink_db;
use ziplink_db;

create table users(
id bigint primary key auto_increment,
user_name varchar(70) NOT NULL,
user_email varchar(70) NOT NULL unique,
created_at dateTime default now()
);

create table user_login(
id bigint primary key auto_increment,
user_id bigint,
user_email VARCHAR(255) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL,
created_at datetime DEFAULT now(),
FOREIGN KEY (user_id) REFERENCES users(id)
);

create table url_mapping(
id bigint primary key auto_increment,
user_id bigint,
short_url varchar(20) unique,
long_url varchar(2000),
url_name VARCHAR(50),
created_at datetime Default now(),
foreign key (user_id) references users(id)
);

CREATE TABLE click_events (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id bigint,
    short_url VARCHAR(255),
    url_name VARCHAR(50),
    ip VARCHAR(255),
    time_stamp BIGINT,
    created_at datetime Default now(),
    PRIMARY KEY (id),
    foreign key (user_id) references users(id)
);

CREATE INDEX idx_short_url ON url_mapping(short_url);
CREATE INDEX idx_click_events ON click_events(user_id);
CREATE INDEX idx_user_login ON user_login(user_email);