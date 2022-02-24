const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const Contenedor = require('./Ej2')
const objContenedor = new Contenedor();
let datos =  objContenedor.getAll()
const app = express();
const routerP = express.Router()
const routerC = express.Router()
const {Server: HttpServer} = require('http');
const {Server: IOServer} = require('socket.io');


//MIDDLEWEARS
app.use(morgan('tiny'))
app.use(express.json())
app.use(bodyParser.urlencoded({extended : true}))
app.use(express.static('public'))
app.use('/api/productos',routerP)
app.use('/api/carrito',routerC)


const isAdminT= () => {
    return true
}
//WEBSOCKETS
let id = ''
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
io.on('connection',socket => {
    console.log('Un cliente se ha conectado ' + socket.id);
    id = socket.id
    
});


//ROUTES

//ROUTER PRODUCTOS

routerP.get('/', (req, res) => {
    res.render('./main')
})


routerP.get('/productos', (req,res) => {
    res.send(datos)
})


routerP.get('/:id', (req, res ) => {
        const id = req.params
        const producto = objContenedor.getByid(parseInt(id.id))
        if (producto) {
            res.send(producto)
        }
       else {
           res.render(datos)
        }
})

routerP.post('/', (req, res) => {
    if (isAdminT()) {
        const lastId = datos[datos.length-1].id;
        const data = {
            title: req.body.title,
            price: req.body.price,
            thumbnail: req.body.thumbnail,
            id:lastId+1
        }
        datos.push(data)
        res.redirect('/')
    }
    else{
        res.status(400).json({error:'No estas autorizado a realizar esta accion'})
    }
   
    
})
routerP.put('/:id', (req, res) => {
    if(isAdminT){
        const filterDatos = datos.filter( i => i.id != parseInt(req.params.id))
        const data = {
            title: req.body.title,
            price: req.body.price,
            thumbnail: req.body.thumbnail,
            id: parseInt(req.params.id)
        }
        filterDatos.push(data)
        filterDatos.sort((a, b) => {
            if (a.id > b.id) {
              return 1;
            }
            if (a.id < b.id) {
              return -1;
            }
            return 0;
          });
          datos = filterDatos;
    }
    else{
        res.status(400).json({error:'No estas autorizado a realizar esta accion'})
    }
   
})

routerP.delete('/:id', (req, res) => {
    if(isAdminT){
        const filterDatos = datos.filter( i => i.id != parseInt(req.params.id))
        datos = filterDatos;
        io.emit('redirect',filterDatos)
    }   
    else{
        res.status(400).json({error:'No estas autorizado a realizar esta accion'})
    }

})

app.get('/*', (req, res) => {
    res.status(400).json({error:'-1', descripcion:`ruta  no autorizada`})
})

//ROUTER CARRITO
let Carts = []
routerC.post('/', (req, res) => {
    const newCart = {
        cartId:id, 
        productos:[],
        timestap : new Date().toLocaleString()}
    Carts.push(newCart)
    res.send(Carts)
    
})

routerC.delete('/:id', (req, res) => {
    let filterCart = Carts.filter(i => req.params.id != i.cartId)
    Carts = filterCart
    res.send(Carts)

})
routerC.get('/:id/productos',( req,res ) => { 
    const getCart = Carts.filter( i => req.params.id == i.cartId)
    const getProductos = getCart.map( i => i.productos)
    console.log(getProductos)
    res.send(getProductos)
})

routerC.post('/:id/productos', (req, res) => {

    res.send(id)
})




const PORT = 8080

const server = httpServer.listen(PORT, () => {
    console.log('Escuchando en el puerto' + PORT);
})

server.on('err', (error) => {
    console.log(error)
})



