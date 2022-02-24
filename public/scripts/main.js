const socket = io.connect()

const renderProductos = (response) => {
    const html = document.getElementById('container')
        const data =  response.map(item => {
                return(
                    `
                            <div class="col-4">
                                <div class="card bg-secondary" style="width: 12rem;">
                                    <img src="${item.thumbnail}" class="card-img-top" alt="...">
                                    <div class="card-body">
                                        <h5 class="card-title">${item.title}</h5>
                                        <p class="card-text">${item.price}</p>
                                        <p>ID: ${item.id} </p>
                                        <div class='card-buttons'>
                                            <a  class="btn btn-primary">Actualizar</a>
                                            <a onclick='deteleItem(${item.id})' class="btn btn-primary">Eliminar</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    `    
            )})
        html.innerHTML=data.join(' ')          
}

fetch('/api/productos/productos',{
    method:'GET'
})
.then(res => res.json().then( res => {renderProductos(res)}))

.catch( err => {console.log(err)})




const deteleItem =  (id)  => {
     fetch(`/api/productos/${id}` ,{
        method:'DELETE'
    })
    .catch( err => {console.log(err)})
        
    }
    
socket.on('redirect', (data) => {
    renderProductos(data)
})
