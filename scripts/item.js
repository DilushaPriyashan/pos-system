const loadData=()=>{
    $('#item-body').empty();

    const firestore = firebase.firestore();
    firestore
    .collection('items')
    .get()
    .then((result)=>{
        result.forEach((records)=>{
            const data = records.data();
            const row=`
            <tr>
                <td>${records.id}</td>
                <td>${data.description}</td>
                <td>${data.qtyOnHand}</td>
                <td>${data.unitPrice}</td>
            </tr>
            `;

            $('#item-body').append(row);   
        });
    });

}