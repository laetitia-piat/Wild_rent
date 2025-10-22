# Guide des Conventional Commits

Les **Conventional Commits** permettent de structurer les messages de commit pour améliorer la lisibilité et l'automatisation (changelog, versioning, etc.).

# Types

- **feat** : ajout d'une nouvelle fonctionnalité
- **fix** : correction d'un bug
- **docs** : mise à jour de la documentation
- **style** : modification du style (indentation, espaces, etc.), sans impact fonctionnel
- **refactor** : amélioration du code sans modifier son comportement
- **perf** : amélioration des performances
- **test** : ajout ou modification de tests
- **chore** : tâches diverses (MAJ de dépendances, scripts, etc.)
- **ci** : modification des fichiers liés à l'intégration continue
- **build** : modification de la configuration du projet (webpack, package.json, etc.)

# Exemple de commits

Voici un exemple de commit conforme aux Conventional Commits, basé sur la branche `feature/01`

Le numéro 01 faisait référence au ticket qui a été assigné à l'auteur du commit.

Commencer chaque commit **par un verbe** permet d’avoir un historique de commits homogène et facile à lire.

- feat(01): ajoute la modal de connexion utilisateur

Avec cette structure, l'historique Git sera clair, homogène et facile à lire ! 🚀