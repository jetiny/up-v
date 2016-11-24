# up-v

update npm package version

### install

```
npm i -g up-v
```

### usage

cd your project.json directory then run
```
upv
```
the last version number will be added one (eg: 1.0.0 => 1.0.1)

### options in project.json

```js
{
  "name": "up-v",
  "version": "1.0.3",
  "upv": 2
}
```

the result: 1.0.0 => 1.1.0
