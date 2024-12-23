pushd backend
poetry export --without-hashes --format=requirements.txt > requirements.txt
popd