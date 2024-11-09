import pydantic_settings
from functools import lru_cache


class AppConfig(pydantic_settings.BaseSettings):
    storage_root: str
    db_host: str
    db_port: str
    db_user: str
    db_password: str
    db_name: str
    supa_url: str
    supa_key: str

    class Config:
        validate_assignment = True

    @property
    def db_url(self):
        return f"postgresql://{self.db_user}:{self.db_password}@{self.db_host}:{self.db_port}/{self.db_name}"


@lru_cache
def get_config():
    return AppConfig()  # type: ignore
