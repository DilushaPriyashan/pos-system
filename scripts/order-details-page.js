const loadData=()=>{
    const params={};

    const queryParameter = new URLSearchParams(window.location.search);

    const id = queryParameter.get('id');


    const firestore = firebase.firestore();

    firestore
        .collection('orders')
        .doc(id)
        .get().then((response) => {
            if (response.exists) {
                const data = response.data();
                console.log(data);


                // order data

                const orderRow=`
                <tr>
                    <td>${response.id}</td>
                    <td>${data.orderDate}</td>
                    <td>${data.totalCost}</td>
                </tr>
                `;
                $('#order-table-body').append(orderRow);

                // customer data

                const customerRow=`
                <tr>
                    <td>${data.customer.customerId}</td>
                    <td>${data.customer.name}</td>
                    <td>${data.customer.address}</td>
                    <td>${data.customer.salary}</td>
                </tr>
                `;
                $('#customer-table-body').append(customerRow);

                // item data

                data.items.forEach(record=>{
                    const itemRow=`
                    <tr>
                        <td>${record.code}</td>
                        <td>${record.description}</td>
                        <td>${record.qty}</td>
                        <td>${record.unitPrice}</td>
                        <td>${record.totalCost}</td>
                    </tr>
                    `;
                    $('#item-table-body').append(itemRow);
                });
                print();
            }
        })
}