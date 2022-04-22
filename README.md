# Fetchr

window.fetch wrapper with cacheStorage support, abortController, timeout and body transformation

A Fetchr request is a basic Request, with 3 additional options

- cacheable: number // duration in ms of the CacheStorage entry, only for GET request
- cancellable: boolean // give the request the power to be aborted
- timeout: number // fix limit to bad performance

You can pass data to your request with

- body: Standard implementation, you got the control
- json: the object will be transformed with JSON.stringify
- form: the object will be transformed with URLSearchParams
- blob: will come soon

## GET

```javascript
await Fetchr({
    url: 'https://jsonplaceholder.typicode.com/users/7',
    cacheable: 1000 * 60 * 60, // 1 hour
    cancellable: true,
    timeout: 5000,
    headers: {
        Authorization: 'Bearer 1234abcd',
        ClientId: "1234",
        ClientSecret: "abcdef"
    }
}).then((res: FetchrResponseType) => {...})
```

## POST as JSON

```javascript
await Fetchr({
    url: 'https://jsonplaceholder.typicode.com/users/7',
    method: "POST",
    json: {
        username: "JohnD",
        firstname: "John",
        lastname: "Doe"
    },
    cancellable: true,
    timeout: 5000,
    headers: {
        Authorization: 'Bearer 1234abcd',
        ClientId: "1234",
        ClientSecret: "abcdef"
    }
}).then((res: FetchrResponseType) => {...})
```

## POST as FormData

```javascript
await Fetchr({
    url: 'https://jsonplaceholder.typicode.com/users/7',
    method: "POST",
    form: {
        username: "JohnD",
        firstname: "John",
        lastname: "Doe"
    },
    cancellable: true,
    timeout: 5000,
    headers: {
        Authorization: 'Bearer 1234abcd',
        ClientId: "1234",
        ClientSecret: "abcdef"
    }
}).then((res: FetchrResponseType) => {...})
```

# Client

A Fetchr wrapper with sugar

Create your own configuration for one particular endpoint

- shared configuration for all request
- syntaxic sugar for duration
- response type management (json, form, text, buffer, blob)
- and more to come...

## type="json" (default)
```javascript
let myApi = new Client({
    headers: {
        clientId: '1a2b3c4d',
        clientSecret: 'azertyuiop'
    },
    cacheable: "1h",
    timeout: "10s"
})

myApi.GET('https://jsonplaceholder.typicode.com/users/7').then((res: FetchrResponseType) => {...})
myApi.GET({
    url: 'https://jsonplaceholder.typicode.com/users/7',
    cacheable: "5m"
}).then((res: FetchrResponseType) => {
    console.log(res.data) // { "id": 7, "name": "Kurtis Weissnat"...}
})
```

## type="blob"

```javascript
myApi.GET({
    url: 'https://mydomain.com/myImage.jpeg',
    cacheable: "5m",
    type: 'blob'
}).then((res: FetchrResponseType) => {
    console.log(res.data) // "data:image/jpeg;base64..."
})
```

## type="text"

```javascript
myApi.GET({
    url: 'https://mydomain.com/myFile.txt',
    cacheable: "5m",
    type: "text"
}).then((res: FetchrResponseType) => {
    console.log(res.data) // "lorem ipsum..."
})
```
