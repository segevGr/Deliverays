
import sys
from mikud import Mikud
import re

pattern = r'^(.+?) (\d+), (.+)$' # REGEX pattern for address
mikud = Mikud()

address = sys.argv[1]
result = "0"

match = re.match(pattern, address)
if match:
    street_name = match.group(1)
    house_number = match.group(2)
    city = match.group(3)
    mikud_res = mikud.search_mikud(city_name=city,
                                    street_name=street_name,
                                    house_number=house_number)

    if (mikud_res.zip != ""):
        addr = mikud.search_address(zip_code=mikud_res.zip)
        result = "{} {}, {}".format(addr.street_name, addr.house_number, addr.city_name)
else:
    result = "0"

resultEncoded = result.encode("UTF-8")
sys.stdout.buffer.write(resultEncoded)
sys.stdout.flush()

