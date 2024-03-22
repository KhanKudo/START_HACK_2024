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
     {"role": "system", "content": "Output format for each match exactly: (Main-compentency, Sub-competency,grade);"},

    {"role": "system", "content": "Output format for each match exactly: (Main-compentency, Sub-competency,grade), Assign the recieved phrases to following competencies, not all competencies have to be present. There are grades 1-100 included, 100 is best, which should also be assigned unchanged to the correct compenency. there are 3 main competencies eech having 3 sub-competencies. The kriteria for each competency is in the brackets: A)Zahl und Variable 1.)Operieren und Benennen(Die Schülerinnen und Schüler verstehen und verwenden arithmetische Begriffe und Symbole. Sie lesen und schreiben Zahlen, Die Schülerinnen und Schüler können flexibel zählen, Zahlen nach der Grösse ordnen und Ergebnisse überschlagen., Die Schülerinnen und Schüler können addieren, subtrahieren, multiplizieren, dividieren und potenzieren.,Die Schülerinnen und Schüler können Terme vergleichen und umformen, Gleichungen lösen, Gesetze und Regeln anwenden.) 2) Erforschen und Argumentieren (Die Schülerinnen und Schüler können Zahl- und Operationsbeziehungen sowie arithmetische Muster erforschen und Erkenntnisse austauschen.,Die Schülerinnen und Schüler können Aussagen, Vermutungen und Ergebnisse zu Zahlen und Variablen erläutern, überprüfen, begründen.,Die Schülerinnen und Schüler können beim Erforschen arithmetischer Muster Hilfsmittel nutzen.) 3) Mathematisieren und Darstellen (Die Schülerinnen und Schüler können Rechenwege darstellen, beschreiben, austauschen und nachvollziehen., Die Schülerinnen und Schüler können Anzahlen, Zahlenfolgen und Terme veranschaulichen, beschreiben und verallgemeinern.) B) Form und Raum 1) Operieren und Benennen (Die Schülerinnen und Schüler verstehen und verwenden Begriffe und Symbole., Die Schülerinnen und Schüler können Figuren und Körper abbilden, zerlegen und zusammensetzen., Die Schülerinnen und Schüler können Längen, Flächen und Volumen bestimmen und berechnen.) 2) Erforschen und Argumentieren (Die Schülerinnen und Schüler können geometrische Beziehungen, insbesondere zwischen Längen, Flächen und Volumen, erforschen, Vermutungen formulieren und Erkenntnisse austauschen., Die Schülerinnen und Schüler können Aussagen und Formeln zu geometrische Beziehungen überprüfen, mit Beispielen belegen und begründen.) 3) Mathematisieren und Darstellen (Die Schülerinnen und Schüler können Körper und räumliche Beziehungen darstellen., Die Schülerinnen und Schüler können Figuren falten, skizzieren, zeichnen und konstruieren sowie Darstellungen zur ebenen Geometrie austauschen und überprüfen., Die Schülerinnen und Schüler können sich Figuren und Körper in verschiedenen Lagen vorstellen, Veränderungen darstellen und beschreiben (Kopfgeometrie).,Die Schülerinnen und Schüler können in einem Koordinatensystem die Koordinaten von Figuren und Körpern bestimmen bzw. Figuren und Körper aufgrund ihrer Koordinaten darstellen sowie Pläne lesen und zeichnen.) C) Grössen, Funktionen, Daten und Zufall 1) Operieren und Benennen (Die Schülerinnen und Schüler verstehen und verwenden Begriffe und Symbole zu Grössen, Funktionen, Daten und Zufall., Die Schülerinnen und Schüler können Grössen schätzen, messen, umwandeln, runden und mit ihnen rechnen. Die Schülerinnen und Schüler können funktionale Zusammenhänge beschreiben und Funktionswerte bestimmen.)2) Erforschen und Argumentieren (Die Schülerinnen und Schüler können zu Grössenbeziehungen und funktionalen Zusammenhängen Fragen formulieren, diese erforschen sowie Ergebnisse überprüfen und begründen. Die Schülerinnen und Schüler können Sachsituationen zur Statistik, Kombinatorik und Wahrscheinlichkeit erforschen, Vermutungen formulieren und überprüfen.)3) Mathematisieren und Darstellen (Die Schülerinnen und Schüler können Daten zu Statistik, Kombinatorik und Wahrscheinlichkeit erheben, ordnen, darstellen, auswerten und interpretieren.,Die Schülerinnen und Schüler können Sachsituationen mathematisieren, darstellen, berechnen sowie Ergebnisse interpretieren und überprüfen.Die Schülerinnen und Schüler können Terme, Formeln, Gleichungen und Tabellen mit Sachsituationen konkretisieren.)"},
   {"role": "user", "content": "Zusatz: Ich kann Sinusschwingungen erkären ,100;"}
]
)

#print(response.choices[0].message)
print ("{\"main-competency\":"+
"\""+re.search ("([A-Za-z]+ ?)+(?![#\\*\\d])",response.choices[0].message.content).group(0)+"\","+
"\"sub-competency\":"+
"\""+re.search ("(?<=, )([A-Za-z]+ ?)+(?![#\\*\\d])",response.choices[0].message.content).group(0)+"\","+
"\"grade\":"+
"\""+re.search ("([0-9]+ ?)+(?![#\\*\\d])",response.choices[0].message.content).group(0)+"\""+
"}")
