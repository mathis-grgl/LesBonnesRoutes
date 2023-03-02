import sys
from jinja2 import Environment, FileSystemLoader

# Crée un environnement Jinja2 avec le dossier des templates
env = Environment(loader=FileSystemLoader('.'))

page = sys.argv[1] + '.html'

# Charge le template '"page".html'
template = env.get_template(page)

# Render le template avec les paramètres souhaités
output = template.render()

# Affiche le résultat
print(output)