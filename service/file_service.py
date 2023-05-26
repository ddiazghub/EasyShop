import uuid
import pathlib
import os
from fastapi import UploadFile
from model.error import CANT_KNOW_FILETYPE, FILE_TOO_LARGE

UPLOAD_DIRECTORY = "static/img"

async def upload_file(file: UploadFile) -> str:
    upload_filename = file.filename

    if not upload_filename:
        raise CANT_KNOW_FILETYPE
    
    extension = pathlib.Path(upload_filename).suffix
    filename = f"{uuid.uuid4().hex}{extension}"
    filepath = f"{UPLOAD_DIRECTORY}/{filename}" 
    failed = False

    with open(filepath, "wb") as out:
        file_size = 0
        read = await file.read(65536)
        
        while read:
            file_size += len(read)

            if (file_size > 5_000_000):
                failed = True
                break

            out.write(read)
            read = await file.read(65536)
    
    if failed:
        os.remove(filepath)
        
        raise FILE_TOO_LARGE
    
    return f"/img/{filename}"