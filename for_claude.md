# Kontynuacja zadania: Migracja budowania wheel do manylinux_2_28

## Cel zadania
Migracja budowania Python wheel wax z manylinux2014 (CentOS 7, glibc 2.17) do manylinux_2_28 (AlmaLinux 8, glibc 2.28) ze względu na kompatybilność z OpenSSL.

## WAŻNE ZASADY
- **NIE modyfikuj plików źródłowych** - kontener ma się dostosować do bazy kodu, nie odwrotnie
- Cmake instalować z Kitware (manylinux_2_28 ma cmake 4.x który łamie hive/fc)
- Ninja instalować via pip
- NIE modyfikować build.py

## Aktualny stan

### Pliki utworzone/zmodyfikowane:
1. `/home/raidg/work/hive/wax/python/docker/Dockerfile.manylinux` - główny Dockerfile dla manylinux_2_28
2. `/home/raidg/work/hive/wax/python/scripts/build_wax_manylinux.sh` - skrypt budowania

### Pliki źródłowe (MUSZĄ być oryginalne):
- `python/CMakeLists.txt` - REVERTED (bez zmian)
- `python/cmake/FindPythonExtensions.cmake` - REVERTED (bez zmian)

### Co zostało rozwiązane:
1. **distutils missing** - Python 3.12 usunął distutils → zainstaluj setuptools via pip
2. **Brak statycznych bibliotek OpenSSL** - budowanie OpenSSL 1.1.1k ze źródeł z `no-shared -fPIC` do `/usr/local`
3. **Brak statycznego bzip2** - budowanie bzip2 ze źródeł z `-fPIC` do `/usr/local`
4. **cmake 4.x łamie fc** - instalacja cmake 3.28 z Kitware
5. **zopfli missing** - budowanie zopfli ze źródeł dla generowania words.deflate
6. **BOOST_ROOT** - dodano `ENV BOOST_ROOT=/wax_boost_root/` w Dockerfile
7. **OPENSSL_ROOT_DIR** - dodano `ENV OPENSSL_ROOT_DIR=/usr/local` w Dockerfile

### Co wymaga weryfikacji (aktualnie w trakcie):
Docker image dla Python 3.12 jest w trakcie budowania (backgrounded):
```
task ID: b0e3770
output: /tmp/claude/-home-raidg-work-hive-wax/tasks/b0e3770.output
```

Sprawdź status:
```bash
tail -100 /tmp/claude/-home-raidg-work-hive-wax/tasks/b0e3770.output
```

Lub przebuduj obraz ręcznie:
```bash
docker buildx build --progress=plain --target=wax-manylinux --build-arg PYTHON_VERSION=3.12 -t wax-manylinux:py3.12-test -f python/docker/Dockerfile.manylinux .
```

## Następne kroki

1. **Poczekaj na zakończenie budowania obrazu Docker** - sprawdź output powyższego zadania
2. **Przetestuj budowanie wheel dla Python 3.12**:
   ```bash
   ./python/scripts/build_wax_manylinux.sh 3.12
   ```
3. **Jeśli build się nie powiedzie** - sprawdź logi i rozwiąż problemy TYLKO poprzez modyfikację Dockerfile/build script, NIE modyfikując źródeł
4. **Przetestuj dla Python 3.14**:
   ```bash
   ./python/scripts/build_wax_manylinux.sh 3.14
   ```

## Możliwe problemy do rozwiązania przez kontener (NIE przez modyfikację źródeł)

### Problem z Python include directories dla cmake
FindPythonLibs może nie znaleźć nagłówków Python z manylinux. Obecne rozwiązanie w Dockerfile:
```dockerfile
ln -sf "${PYTHON_PATH}/include/python${PYTHON_VERSION}" /usr/local/include/python${PYTHON_VERSION} && \
ln -sf "${PYTHON_PATH}/include/python${PYTHON_VERSION}" /usr/include/python${PYTHON_VERSION}
```

Jeśli to nie wystarczy, spróbuj dodać cmake args w build.py:
```bash
cmake ... -DPYTHON_INCLUDE_DIR=/opt/python/cp312-cp312/include/python3.12
```

### Problem z Boost include directory
fc library używa `${Boost_INCLUDE_DIR}` przed wywołaniem `find_package(Boost)`. Obecne rozwiązanie: cmake powinno znaleźć Boost przez `BOOST_ROOT` env var.

Jeśli nadal nie działa, dodaj cmake args:
```bash
cmake ... -DBoost_INCLUDE_DIR=/wax_boost_root/include -DBoost_USE_STATIC_LIBS=ON
```

### Problem z Boost_USE_STATIC_RUNTIME
Boost jest budowany z `runtime-link=static`. Może być potrzebne:
```bash
cmake ... -DBoost_USE_STATIC_RUNTIME=ON
```

## Kluczowe pliki do zrozumienia

- `hive/libraries/fc/CMakeLists.txt:139` - `SET(BOOST_ROOT $ENV{BOOST_ROOT})`
- `hive/cmake/hive_targets.cmake` - makra dla Boost (dynamicznie ustawia Boost_USE_STATIC_LIBS)
- `python/scripts/prepare_boost.sh` - jak Boost jest budowany (z runtime-link=static)
- `python/build.py` - główny skrypt budowania (NIE MODYFIKOWAĆ)

## Zmienne środowiskowe wymagane w kontenerze

```bash
export BOOST_ROOT=/wax_boost_root/
export WAX_BOOST_ROOT=/wax_boost_root/
export OPENSSL_ROOT_DIR=/usr/local
export PATH=/opt/python/cp312-cp312/bin:/usr/local/bin:$PATH  # dla Python 3.12
```

## Weryfikacja że źródła są oryginalne

```bash
git diff python/CMakeLists.txt python/cmake/FindPythonExtensions.cmake
# Powinno być puste - jeśli nie, zrób git checkout na tych plikach
```

## Poprzednio zbudowany wheel (przed rewertem źródeł - ze zmodyfikowanymi źródłami)

```
hiveio_wax-1.28.4rc1.dev106+917fa463-cp312-cp312-manylinux_2_28_x86_64.whl (6.2MB)
```

Cel: zbudować takie samo wheel **bez modyfikacji plików źródłowych**, tylko przez konfigurację kontenera/environment.

## Kontekst użytkownika

Użytkownik wyraźnie powiedział: "ale czemu ty wogóle edytujesz build i bebechy kodu źródłowego? Istnieje kontener, który to robi bez tych zmian, więc kontener nad którym pracujesz powinien się dostosować do aktualnej bazy kodu"

Czyli: istniejący CI kontener (python/docker/Dockerfile.ci bazujący na ubuntu24.04) buduje wheel bez modyfikacji źródeł. Nowy manylinux_2_28 kontener też musi to robić.
