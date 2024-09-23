from decouple import  Config, RepositoryEnv
import hashlib

def hash_key(key):
    hashed_value = hashlib.sha256(key.encode()).hexdigest() # type: ignore
    return hashed_value

def is_secret_hashed(env_content):
    has_been_hashed=False
    for line in env_content:
        var_name, var_value = line.strip().split('=')
        if var_name == 'HAS_BEEN_HASHED':
            has_been_hashed = True
            break
    return has_been_hashed

def create_info_message(env_content):
    if is_secret_hashed(env_content):
        return "Secret has been hashed!"
    else:
        return "Please keep safe 'secret' value, it will be hashed and won't be available next time"

def get_creds():
    env_file_path = 'volume/.env'
    env_config = Config(RepositoryEnv(env_file_path))

    with open('volume/.env', 'r') as env_file:
        lines = env_file.readlines()

    info_message=create_info_message(lines)
    secret = env_config.get('CLIENT_SECRET')
    client_id = env_config.get('CLIENT_ID')
    update_env()
    return {
        'secret':secret,
        'client_id':client_id,
        'hashed':is_secret_hashed(lines),
        'message': info_message,
    }

def update_env():
    env_file_path = 'volume/.env'
    # Give special path to python-decouple to find volume 
    env_config = Config(RepositoryEnv(env_file_path))
    secret = env_config.get('CLIENT_SECRET')
    hashed_value = hash_key(secret)
    
    with open('volume/.env', 'r') as env_file:
        lines = env_file.readlines()
    has_been_hashed=is_secret_hashed(lines)
    # Update .env lines
    updated_lines = []
    for line in lines:
        var_name, var_value = line.strip().split('=')
        if var_name == 'CLIENT_SECRET':
            if has_been_hashed == False:
                updated_lines.append(f'{var_name}={hashed_value}\n')
                updated_lines.append(f'HAS_BEEN_HASHED="hashed"\n')
            else:
                updated_lines.append(line)
        elif var_name == 'HAS_BEEN_HASHED':
            updated_lines.append(line)
            has_been_hashed=None
        else:
            updated_lines.append(line)

    # Réécrire le fichier .env avec la valeur écrasée
    with open(env_file_path, 'w') as env_file:
        env_file.writelines(updated_lines)

