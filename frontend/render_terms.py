from jinja2 import Environment, FileSystemLoader

# Crée un environnement Jinja2 avec le dossier des templates
env = Environment(loader=FileSystemLoader('.'))

# Charge le template 'contact.html'
template = env.get_template('terms.html')

# Render le template avec les paramètres souhaités
output = template.render()

# Affiche le résultat
print(output)
