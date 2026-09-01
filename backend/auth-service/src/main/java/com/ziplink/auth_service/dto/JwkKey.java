package com.ziplink.auth_service.dto;

public class JwkKey {
    private String kty; // Key Type (RSA)
    private String use; // Key Application Usage (sig)
    private String alg; // Signature Algorithm (RS256)
    private String kid; // Unique Key ID
    private String n;   // RSA Modulus (Base64URL encoded)
    private String e;   // RSA Public Exponent (Base64URL encoded)


    public JwkKey(String kty, String use, String alg, String kid, String n, String e) {
        this.kty = kty;
        this.use = use;
        this.alg = alg;
        this.kid = kid;
        this.n = n;
        this.e = e;
    }

    public String getKty() {
        return kty;
    }

    public void setKty(String kty) {
        this.kty = kty;
    }

    public String getUse() {
        return use;
    }

    public void setUse(String use) {
        this.use = use;
    }

    public String getAlg() {
        return alg;
    }

    public void setAlg(String alg) {
        this.alg = alg;
    }

    public String getKid() {
        return kid;
    }

    public void setKid(String kid) {
        this.kid = kid;
    }

    public String getN() {
        return n;
    }

    public void setN(String n) {
        this.n = n;
    }

    public String getE() {
        return e;
    }

    public void setE(String e) {
        this.e = e;
    }
}
