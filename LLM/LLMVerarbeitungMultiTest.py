import re
import os
from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()
#client = OpenAI()

client = OpenAI(
   api_key=os.environ.get("OPENAIKEY"),
)

response = client.chat.completions.create(
  model="gpt-3.5-turbo",
seed=4269,	
#  response_format={ "type": "json_object" },
  messages=[
   # {"role": "system", "content": "Output format:NO FULL NAMES OF COMPETECIES ONLY A,B,C,1,2,3, CSV (Main-compentency(A,B,C), Sub-competency(1,2,3),grade);"},
     {"role": "system", "content": "Output format for each match exactly, 1 or more seperated by ; : (Main-compentency; Sub-competency; grade);"},
     
    {"role": "system", "content": "Output format for each match exactly, 1 or more seperated by ; : (Main-compentency; Sub-competency;grade), Assign the recieved phrases to following competencies, not all competencies have to be present. There are grades 1-100 included, 100 is best, which should also be assigned unchanged to the correct compenency. there are 3 main competencies eech having 3 sub-competencies. The kriteria for each competency is in the brackets: A)Zahl und Variable 1.)Operieren und Benennen(Die Schuelerinnen und Schueler verstehen und verwenden arithmetische Begriffe und Symbole. Sie lesen und schreiben Zahlen, Die Schuelerinnen und Schueler koennen flexibel zaehlen, Zahlen nach der Groesse ordnen und Ergebnisse ueberschlagen., Die Schuelerinnen und Schueler koennen addieren, subtrahieren, multiplizieren, dividieren und potenzieren.,Die Schuelerinnen und Schueler koennen Terme vergleichen und umformen, Gleichungen loesen, Gesetze und Regeln anwenden.) 2) Erforschen und Argumentieren (Die Schuelerinnen und Schueler koennen Zahl- und Operationsbeziehungen sowie arithmetische Muster erforschen und Erkenntnisse austauschen.,Die Schuelerinnen und Schueler koennen Aussagen, Vermutungen und Ergebnisse zu Zahlen und Variablen erlaeutern, ueberpruefen, begruenden.,Die Schuelerinnen und Schueler koennen beim Erforschen arithmetischer Muster Hilfsmittel nutzen.) 3) Mathematisieren und Darstellen (Die Schuelerinnen und Schueler koennen Rechenwege darstellen, beschreiben, austauschen und nachvollziehen., Die Schuelerinnen und Schueler koennen Anzahlen, Zahlenfolgen und Terme veranschaulichen, beschreiben und verallgemeinern.) B) Form und Raum 1) Operieren und Benennen (Die Schuelerinnen und Schueler verstehen und verwenden Begriffe und Symbole., Die Schuelerinnen und Schueler koennen Figuren und Koerper abbilden, zerlegen und zusammensetzen., Die Schuelerinnen und Schueler koennen Laengen, Flaechen und Volumen bestimmen und berechnen.) 2) Erforschen und Argumentieren (Die Schuelerinnen und Schueler koennen geometrische Beziehungen, insbesondere zwischen Laengen, Flaechen und Volumen, erforschen, Vermutungen formulieren und Erkenntnisse austauschen., Die Schuelerinnen und Schueler koennen Aussagen und Formeln zu geometrische Beziehungen ueberpruefen, mit Beispielen belegen und begruenden.) 3) Mathematisieren und Darstellen (Die Schuelerinnen und Schueler koennen Koerper und raeumliche Beziehungen darstellen., Die Schuelerinnen und Schueler koennen Figuren falten, skizzieren, zeichnen und konstruieren sowie Darstellungen zur ebenen Geometrie austauschen und ueberpruefen., Die Schuelerinnen und Schueler koennen sich Figuren und Koerper in verschiedenen Lagen vorstellen, Veraenderungen darstellen und beschreiben (Kopfgeometrie).,Die Schuelerinnen und Schueler koennen in einem Koordinatensystem die Koordinaten von Figuren und Koerpern bestimmen bzw. Figuren und Koerper aufgrund ihrer Koordinaten darstellen sowie Plaene lesen und zeichnen.) C) Groessen, Funktionen, Daten und Zufall 1) Operieren und Benennen (Die Schuelerinnen und Schueler verstehen und verwenden Begriffe und Symbole zu Groessen, Funktionen, Daten und Zufall., Die Schuelerinnen und Schueler koennen Groessen schaetzen, messen, umwandeln, runden und mit ihnen rechnen. Die Schuelerinnen und Schueler koennen funktionale Zusammenhaenge beschreiben und Funktionswerte bestimmen.)2) Erforschen und Argumentieren (Die Schuelerinnen und Schueler koennen zu Groessenbeziehungen und funktionalen Zusammenhaengen Fragen formulieren, diese erforschen sowie Ergebnisse ueberpruefen und begruenden. Die Schuelerinnen und Schueler koennen Sachsituationen zur Statistik, Kombinatorik und Wahrscheinlichkeit erforschen, Vermutungen formulieren und ueberpruefen.)3) Mathematisieren und Darstellen (Die Schuelerinnen und Schueler koennen Daten zu Statistik, Kombinatorik und Wahrscheinlichkeit erheben, ordnen, darstellen, auswerten und interpretieren.,Die Schuelerinnen und Schueler koennen Sachsituationen mathematisieren, darstellen, berechnen sowie Ergebnisse interpretieren und ueberpruefen.Die Schuelerinnen und Schueler koennen Terme, Formeln, Gleichungen und Tabellen mit Sachsituationen konkretisieren.)"},
   {"role": "user", "content": "Zusatz: Ich kann Sinusschwingungen erkaeren ,100; Ich kann den Flaecheninhalt von Kreisen berechnen, 60; Ich kann haendisch dividieren, 32"}
]
)
gptout=response.choices[0].message.content
#print(response.choices[0].message)
#end=0;
while (re.search("\([A-Za-z;, 0-9]+\)",gptout) != None):
	#print(end)
	print ("{\"main-competency\": \"")
	outstr=re.search ("([A-Za-z, ]+ ?)+(?![#*\d])",gptout)
	print(outstr.group(0))
	print ("\", \"sub-competency\": \"")
	outstr=re.search ("(?<=; )([A-Za-z, ]+ ?)+(?![#*\d])",gptout)
	print(outstr.group(0))
	print ("\", \"grade\": \"")
	outstr=re.search ("([0-9]+ ?)+(?![#*\d])",gptout)
	print(outstr.group(0))
	print ("\"}")
	#print(response.choices[0].message)
	#re.sub ("\(.+\)[;]",'',gptout)
	gptout=re.sub("\([A-Za-z;, 0-9]+\)",'',gptout,count=1)
	#end=re.search("\([A-Za-z;, 0-9]+\)",gptout)
	
