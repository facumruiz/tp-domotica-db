import csv
import sqlite3 #se importan las libreria para trabajar con la base de datos

archivo = open(r"C:\IFTS14 SISTEMAS EMBEBIDOS E INTERNET DE LAS COSAS\PP2 2025\TP DOMOTICA 2025\datos_domotica.csv") #Abre el archivo CSV ubicado en esa ruta. El prefijo r indica que es una cadena raw, útil para rutas en Windows

filas   = csv.reader(archivo,delimiter=",") #Lee el archivo CSV usando ; como delimitador entre columnas.

lista = list (filas) #listo los datos
#print(lista)
del (lista[0]) #Elimina la primera fila, que normalmente contiene los encabezados (nombres de las columnas).
#print(lista)
tuplaa = tuple(lista) #Convierte la lista de listas en una tupla de tuplas, que es el formato que espera executemany() para insertar múltiples registros en la base de datos
#print(lista)
#print(tuplaa)

#insertar

conexion = sqlite3.connect("domotica_db.db") #Esto crea una conexión a una base de datos SQLite llamada csvpyinsert.db. Si el archivo no existe, SQLite lo crea automáticamente.
cursor   = conexion.cursor() #Se crea un cursor, que es el objeto que permite ejecutar comandos SQL sobre la base de datos.
cursor.executemany("INSERT OR REPLACE INTO tabladomotica_db ('id_db','fecha_db','hora_db','temperatura_db_C','humedad_db_porciento','presencia_db','nivel_luz_Lux','tension_db_V','corriente_db_A','energia_db_kWh','energia_acumulada_db_kWh') VALUES (?,?,?,?,?,?,?,?,?,?,?)",tuplaa)
#executemany Esta función ejecuta la misma instrucción SQL varias veces, usando una lista de tuplas (tuplaa) como datos. Es útil para insertar muchos registros de una sola vez.
conexion.commit() #commit guarda los cambios realizados enla base de datos
conexion.close() #se cierra la conexión a la base de datos