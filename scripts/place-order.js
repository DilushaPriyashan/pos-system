let orders = [];

const loadIds = () => {
    loadCustomerIds();
    loadItemIds();
}

const loadCustomerIds = () => {
    $('#customer-id').empty();

    const firestore = firebase.firestore();

    firestore
        .collection('customers')
        .get()
        .then(records => {
            records.forEach((result) => {
                const option = $('<option></option>').val(result.id).text(result.id);
                $('#customer-id').append(option);
            })
        })
}

$('#customer-id').on("change", function () {
    const customerId = $(this).val();
    const firestore = firebase.firestore();

    firestore
        .collection('customers')
        .doc(customerId)
        .get().then((response) => {
            if (response.exists) {
                const data = response.data();
                $('#name').val(data.name);
                $('#address').val(data.address);
                $('#salary').val(data.salary)
            }
        })
})

const loadItemIds = () => {
    $('#item-id').empty();

    const firestore = firebase.firestore();

    firestore
        .collection('items')
        .get()
        .then(records => {
            records.forEach((result) => {
                const option = $('<option></option>').val(result.id).text(result.id);
                $('#item-id').append(option);
            })
        })
}

$('#item-id').on("change", function () {
    const itemId = $(this).val();
    const firestore = firebase.firestore();

    firestore
        .collection('items')
        .doc(itemId)
        .get().then((response) => {
            if (response.exists) {
                const data = response.data();
                $('#description').val(data.description);
                $('#unit-price').val(data.unitPrice);
                $('#qty-on-hand').val(data.qtyOnHand)
            }
        })
})

const addToCart = () => {
    const unitPrice = Number.parseInt($('#unit-price').val());
    const qty = Number.parseInt($('#qty').val());
    const totalCost = unitPrice * qty;

    const cartObj = {
        "code": $('#item-id').val(),
        "description": $('#description').val(),
        "unitPrice": unitPrice,
        "qty": qty,
        "totalCost": totalCost
    };
    orders.push(cartObj);

    $('#cart-body').empty();
    orders.forEach((data,index) => {
        const row = `
        <tr>
            <td>${data.code}</td>
            <td>${data.description}</td>
            <td>${data.unitPrice}</td>
            <td>${data.qty}</td>
            <td>${data.totalCost}</td>
            <td><button type="button" class="btn-close" aria-label="Close" onClick="deleteItem(${index})"></button></td> 
        </tr>
        `;
        $('#cart-body').append(row);
    });
    calculateCost();
}

const calculateCost=()=>{
    let ttl=0;

    orders.forEach(data => {
        ttl+=data.totalCost;
               
    });
    $('#net-total').val(ttl);
}

const placeOrder=()=>{

    customerId=$('#customer-id').val();

    let obj={
        customer:{
            customerId:customerId,
            name:$('#name').val(),
            address:$('#address').val(),
            salary:Number.parseInt($('#salary').val()),
        },
        orderDate:new Date().toISOString().split('T')[0],
        totalCost:Number.parseInt($('#net-total').val()),
        items:[]
    }

    const firestore=firebase.firestore();

    firestore
        .collection('customers')
        .doc(customerId)
        .get().then((response)=>{
            const data = response.data();
            const customer={
                customerId:customerId,
                name:data.name,
                address:data.address,
                salary:data.salary,
            }
            obj.customer = customer;
        })

        orders.forEach(data=>{
            obj.items.push(data)
        });
 
    firestore
    .collection('orders')
    .add(obj)
    .then((response)=>{
        toastr.success('Success!' , 'Saved.');
    }).catch((error)=>{
        console.log(error);
    });
}

const deleteItem = (index) => {
    orders.splice(index, 1); // Remove the item at the specified index

    $('#cart-body').empty();
    orders.forEach((data, i) => {
        const row = `
        <tr>
            <td>${data.code}</td>
            <td>${data.description}</td>
            <td>${data.unitPrice}</td>
            <td>${data.qty}</td>
            <td>${data.totalCost}</td>
            <td><button type="button" class="btn-close" aria-label="Close" onClick="deleteItem(${i})"></button></td> 
        </tr>
        `;
        $('#cart-body').append(row);
    });

    calculateCost();
}

