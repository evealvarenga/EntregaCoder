import { Faker } from "@faker-js/faker";

const productMock = () => {
    const products = [];
    for (let index = 0; index < 100; index++){
        products.push({
            title: Faker.commerce.productName(),
            category: Faker.commerce.department(),
            description: Faker.commerce.productDescription(),
            price: Faker.commerce.price(),
            thumbnail: Faker.image.urlLoremFlickr({ category: 'abstract' }),
            code: Faker.string.alphanumeric(),
            stock: Faker.number.int({ min: 1, max: 100 })
        })
    }
    return products;
}

export {productMock}