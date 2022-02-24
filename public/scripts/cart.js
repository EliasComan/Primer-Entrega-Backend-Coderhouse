fetch('api/carrito', {
    method:'POST'
 })
 .then( res =>  { 
    res.json().then( i => console.log(i))

 })