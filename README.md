# 广东人民出版社国防教育互动式图书app

app内html资源

## 构建

```shell
yarn

npm run build

```

## Nginx

```shell
 server {
    listen       8191;
    server_name  localhost;

    location / {
        root  html/read;
        index  index.html index.htm;
            try_files $uri $uri /index.html; 
    }

    location /read {
        root html;
        index  index.html index.htm;
            try_files $uri $uri/ read/index.html;
    }
}
```
