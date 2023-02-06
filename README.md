<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

  

```bash

$ docker-compose up

```

  

## Running the app

  

```bash

# development

$ npm  run  start

  

# watch mode

$ npm  run  start:dev
```

  

## Order Module

### Create Orders


Create an order from Front End input. It also calls a function from the stock application to discount the purchased items from the inventory. 
```bash
@Post
 /order
 
#Body:
{	"userId":"user_id_1", 	#Id of user
	"items": [{				#Itens array 
		"productId":1,  	#The sample product list has 10 products (Id: 1 - 10) 
		"quantity":1		#The sample avaliable quantity is  ( Id * 5 )
	}]                      
}  							
```
### Get Orders 
Retrieve all orders
```bash
@Get 
 /order
```
###  Get Orders From User 
Retrieve all orders from an user from user_id
```bash
@Get 
 /order/user/:user_id
```
###  Get Order
Retrieve an specific order from order_id.
```bash
@Get 
 /order/:id
```
###  Update Order 
Change the status of an order. Usually, the Status is the only thing that can be changed after an order is placed. 
```bash
@Patch 
 /order/:id

 # Body: 
{"status":"Delivered"}	

#The possible status list for an order is: 
StatusEnum =  {
	CREATED = 'Created',
	PAID = 'Paid',
	SHIPPED = 'Shipped',
	DELIVERED = 'Delivered',
	CANCELED = 'Canceled'}  #For delete function only
```
###   Delete Order
To maintain historic, usually the orders of a marketplace are not deleted from DB.
The delete function will only change it's Status to 'Canceled' and re-insert the products into the inventory table.
```bash
@Delete 
 /order/:id
``` 

## Cache Module

The orders module has a sample cache service using Redis Database. The TTL is defined  to 5mins for local testing. It's a very basic implementation on Get Orders function.  

## License  

Nest is [MIT licensed](LICENSE).
