const deleteOne = async (cid, _id, product) => {
    const cartId = document.getElementById('cid').value;
    const url = `http://localhost:8080/api/carts/${cartId}/products/${_id}`;
    const data = {
        cartId: cid,
        _id: product._id,
    };
    try {
        const response = await fetch( url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            console.error("Error in delete product to cart:", response.status, response.statusText);
            return;
        }
        const result = await response.json();
    } catch (error) {
        console.log("Error: ", error);
    }
};


const addProductToCart = async (cid, _id, product) => {
    const cartId = document.getElementById('cid').value;
    const id = document.getElementById('pid').value;
    const url = `http://localhost:8080/api/carts/${cartId}/products/${id}`;
    const data = {
        cid: cid, 
        _id: product._id,
    };
    try {
        const response = await fetch( url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            console.error("Error in added product to cart:", response.status, response.statusText);
            return;
        }

        const result = await response.json();
    } catch (error) {
        console.log("Error: ", error);
    }
};

const deleteAll = async (cid) => {
    const cartId = document.getElementById('cid').value;
    const url = `http://localhost:8080/api/carts/${cartId}`;
    const data = {
        cid: cid,  
    };

    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            console.error("Error in delete to cart:", response.status, response.statusText);
            return;
        }
        const result = await response.json();
    } catch (error) {
        console.log("Error: ", error);
    }
};