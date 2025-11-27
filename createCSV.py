import csv                      # Módulo para escribir archivos CSV
import random                   # Módulo para generar valores aleatorios
from datetime import datetime, timedelta  # Módulos para manejar fechas y horas

# 🔧 CONFIGURACIÓN: Modificá estas fechas para definir el rango de simulación
fecha_inicio = datetime(2025, 11, 1, 0, 0)   # Fecha y hora inicial ficticia
fecha_fin = datetime(2025, 11, 9, 0, 0)      # Fecha y hora final ficticia

# 🕒 Intervalo de tiempo entre registros (15 minutos)
intervalo = timedelta(minutes=15)

# 📁 Nombre del archivo CSV de salida
nombre_archivo = 'datos_domotica.csv'

# 🧮 Inicializamos la energía acumulada
energia_acumulada = 0.0

# 🔢 Inicializamos el contador de ID
id_actual = 1

# ✍️ Abrimos el archivo CSV para escritura
with open(nombre_archivo, mode='w', newline='') as archivo_csv:
    escritor = csv.writer(archivo_csv)

    # 🏷️ Escribimos la fila de encabezados, incluyendo el nuevo campo id_db
    escritor.writerow([
        'id_db',
        'fecha_db',
        'hora_db',
        'temperatura_db_C',
        'humedad_db_porciento',
        'presencia_db',
        'nivel_luz_Lux',
        'tension_db_V',
        'corriente_db_A',
        'energia_db_kWh',
        'energia_acumulada_db_kWh'
    ])

    # 🔁 Generamos datos cada 15 minutos entre fecha_inicio y fecha_fin
    tiempo_actual = fecha_inicio
    while tiempo_actual <= fecha_fin:
        # 🧪 Simulación de valores aleatorios dentro de rangos realistas
        temperatura = round(random.uniform(15.0, 30.0), 2)       # °C
        humedad = round(random.uniform(30.0, 70.0), 2)           # %
        presencia = random.randint(0, 1)                         # 0 = no hay, 1 = hay
        luz = round(random.uniform(100.0, 1000.0), 2)            # Lux
        tension = round(random.uniform(210.0, 240.0), 2)         # Voltios
        corriente = round(random.uniform(0.1, 10.0), 2)          # Amperios

        # ⚡ Cálculo de energía instantánea: potencia * tiempo (en horas)
        energia = round((tension * corriente) * (15 / 60) / 1000, 4)  # kWh
        energia_acumulada += energia                                 # Acumulamos energía

        # 🧾 Escribimos la fila con los datos simulados, incluyendo el ID
        escritor.writerow([
            id_actual,
            tiempo_actual.strftime('%Y-%m-%d'),
            tiempo_actual.strftime('%H:%M:%S'),
            temperatura,
            humedad,
            presencia,
            luz,
            tension,
            corriente,
            energia,
            round(energia_acumulada, 4)
        ])

        # ⏩ Avanzamos 15 minutos
        tiempo_actual += intervalo

        # 🔢 Incrementamos el ID para el próximo registro
        id_actual += 1

# ✅ Mensaje final indicando que el archivo fue generado
print(f'✅ Archivo CSV generado exitosamente: {nombre_archivo}')
