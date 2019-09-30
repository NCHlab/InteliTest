from pymongo import MongoClient
import jsonlines


client = MongoClient('localhost', 27017)
# client = MongoClient('mongodb://localhost:27017/')
db = client.intelistyle
collection = db.products


# collection.insert_one(post).inserted_id

# Import data to DB
with jsonlines.open('garment_items.jl') as jl_data:
    for product in jl_data:
        
        # FLattening objects for easier access
        product['product_categories_mapped'] = product['product_categories_mapped'][0]
        product['image_urls'] = product['image_urls'][0]
        product['product_imgs_src'] = product['product_imgs_src'][0]
        product['product_categories'] = product['product_categories'][0]
        
        # Inserts Into MongoDB
        collection.insert_one(product)

print("Completed Upload to DB")