## JWT Tut

### Random Info
- In Express, app.use(express.static()) adds a middleware for serving static files to your Express app.
- Some ways to send data to backend
    - send data as JSON (very common when you're using JS)
    - send data as urlencoded (used by form by default)
- lean method of mongoose
```
    // lean will return a json representation of document
    const user = User.findOne({username, password}).lean()
```

- **use of `res.json()`***
```
    // res.json() take care of something on its own
    // for example setting the headers
    res.json({status: "Ok"})
```
- use of **unique field**
- unique is implemented by indexes in mongodb
- mongoose will not make multiple calls to determine whether field is unique or not
```
const userSchema = new mongoose.Schema({
    // unique means username has to be unique
    // two records cannot have same username
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
})
```
### Database and user data
- Database is not a place to save your passwords directly 
- make sure that the passwords are encrypted properly
    - and users are also able to authenticate themselves easily
- To satisfy both above constraints we use a practice called **Hashing the passwords**
- we pass passwords into a mathematical function which converts that password into garbage 
- SPECIAL_FUNCTION(Password) -> 23klghafdhdsf78fbv
- we will be using `brcypt` to hash our passwords
#### Password algorithms
- The collision should be improbable
- The algorithm should be slow (in case of passwords at least)

### Bcrypt Library
- `bcryptjs` is made for javascript
- `bcrypt` is a low level library
-  `npm i bcrypt --save` will install **node package** around c/c++ binaries.
- `bcrypt` binary is 30 to 40 percent faster but it is not portable
    - we have to install each time to use it.
- To hash a password
```
    // irrespective of how long user makes password
    // bcrypt will convert that pass. into a fixed length
    const encryptedPass = await bcrypt.hash(password, 10)
```
- bcrypt generates different hash everytime even for the same string

## JWT Authentication
- Client -> Server: your client *somehow* has to authenticate who it is
- WHY -> Server is a central computer which YOU control
- Client (John) -> a computer which you don not control
- Clien (John) has to prove that he is Joh

### Ways to authenticate
- Client proves itself somehow on the secret/data (JWT)
- Client-Server share a secret (Cookie)

### Structure of JWT
- Whole JWT will have two dots (.), which will act as a seperator 
- First part is the header of JWT payload
- All three parts are base 64 encoding
- JWT is **not** an **encryption** 
- JWT is **not** for storing **sensetive** data

### Code Snippets
#### update password
```
    // this will give the decoded version of the middle part of jwt
    const user = jwt.verify(token, JWT_SECRET,)
    console.log(user)
```
