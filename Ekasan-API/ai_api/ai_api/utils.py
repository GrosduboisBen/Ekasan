from decouple import  Config, RepositoryEnv
from openai import OpenAI
import time

env_file_path = 'volume/.env'
env_config = Config(RepositoryEnv(env_file_path))
client = OpenAI(api_key=env_config('OPENAI_API_KEY'))

# List Vector Stores.
def test_store():
    print(env_config('OPENAI_API_KEY'))
    vectors = get_vector_store_list()
    print("---VECTORS---")
    for vector in vectors:
        print(vector)
    print("---")

# Delete all vector stores from a list
def remove_all_store(store_list):
   for vector in store_list:
        client.beta.vector_stores.delete(vector.id)

# Delete all files from a given vector
def delete_vector_files(vector_store_id):
    list = get_vector_store_files(vector_store_id=vector_store_id)
    for file in list:
        file_object = file.model_dump()
        file_id = file_object.get('id')
        client.beta.vector_stores.files.delete(file_id=file_id,vector_store_id=vector_store_id)

# Create new Store
def create_store(store_name):
    return client.beta.vector_stores.create(name=store_name)

# Get all files of a given vector store.
def get_vector_store_files(vector_store_id):
    return client.beta.vector_stores.files.list(vector_store_id).data

# All vector stores 
def get_vector_store_list():
    return client.beta.vector_stores.list()

# Vector Store by Id
def get_store_by_id(id):
    return client.beta.vector_stores.retrieve(vector_store_id=id)

# Create file
def create_file(uploaded_file):
    print('NAME',uploaded_file.name)
    return client.files.create(
        file=(uploaded_file.name, uploaded_file),
        purpose='assistants'
    )
# Add a file to vector from their ids.
def add_file_to_vector_store(file_id,vector_store_id):
     client.beta.vector_stores.files.create_and_poll(file_id=file_id,vector_store_id=vector_store_id)

# Retrieve all files
def retrieve_all_files():
    return client.files.list()

# Retrieve file information from an id. 
def retrieve_file_info(file_id):
    return client.files.retrieve(file_id=file_id)
# Delete a file from an id.
def delete_file(file_id):
    return client.files.delete(file_id=file_id)

# Create assistant
def create_assistant(name,instructions,store_id,description):
    return client.beta.assistants.create(
        name=name,
        model="gpt-4-1106-preview",
        instructions=instructions,
        description=description,
         tools=[{"type": "file_search"}],
            tool_resources={
                "file_search": {
                    "vector_store_ids": [store_id]
                }
            }
    )

# Get assistants list
def get_assistant_list():
    return client.beta.assistants.list()

# Get assistant by id
def get_assistant_by_id(assistant_id):
    return client.beta.assistants.retrieve(assistant_id=assistant_id)

# Update Assistant
def update_assistant(assistant_id,name,description,instructions,vector_id):
    return client.beta.assistants.update(
        assistant_id=assistant_id,
        instructions=instructions,
        description=description,
        name=name,
        tool_resources={
            "file_search": {
                "vector_store_ids": [vector_id]
            }
        }
    ) 

# Delete assistant
def delete_assistant_id(assistant_id):
    return client.beta.assistants.delete(assistant_id=assistant_id)

# Create assistant thread on vector store.
def create_assistant_thread(store_id):
    return client.beta.threads.create(
        tool_resources={
            "file_search": {
                "vector_store_ids": [store_id]
            }
        }
    )

# Create Thread Run
def create_thread_user_message(thread_id,content):
    return client.beta.threads.messages.create(
        thread_id=thread_id,
        role="user",
        content=content
    )

# Create Thread run 
def create_thread_run(thread_id,assistant_id,instructions):
    return client.beta.threads.runs.create(
        thread_id=thread_id,
        assistant_id=assistant_id,
        instructions=instructions
    )

# Retrieve run
def retrieve_run(thread_id,run_id):
    return client.beta.threads.runs.retrieve(
        thread_id=thread_id,
        run_id=run_id
    )

# Retrieve answer message from assistant.
def retrieve_thread_message(thread_id,run_id):
    while True:
        run = client.beta.threads.runs.retrieve(thread_id=thread_id, run_id=run_id)
        if run.completed_at is not None:
            break
        print('Waiting')
        time.sleep(1)
    messages = client.beta.threads.messages.list(
        thread_id=thread_id
    )
    return messages.data[0].content[0].text.value

# Delete thread
def delete_thread(thread_id):
    return client.beta.threads.delete(thread_id=thread_id)