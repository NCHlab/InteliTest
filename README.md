README Instructions:

1) Ensure Mongodb is installed
2) Download FlaskApp_API, Install Python packages (using venv optional) from requirements.txt (pip install -r requirements.txt)
3) Install Nodejs 
4) Download frontend files > install reactjs via npm install while in the frontend folder (uses package.json)
5) start mongo database (mongod)
6) import data with python (python data_2_db.py), ensure the file you are uploading is in same directory as FlaskApp_API folder.
7) start python (python backend.py)
8) start reactJS (npm start)


by default you can view all data, hit load more data button
When searching, load more data buttons are disabled, instead use table Next / Prev


With simple search off:

black dress
blue denim

with simple search on:
dress
denim
shoe

(and then refine further with table search)
