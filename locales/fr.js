export default {
  errors: {
    generic_console: "Une erreur est survenue. Consultez la console du navigateur pour plus d'informations"
  },
  api: {
    errors: {
      this_value_should_not_be_blank: 'Cette valeur ne doit pas être vide'
    }
  },
  home: {
    group_authors_books_distribution: {
      group_name: 'Top 10 des auteurs dans la base',
      chart_title: 'Les auteurs les plus présents dans la base, par nombre de livres',
      api_error: 'La récupération de la répartition des livres par auteur a échoué'
    },
    group_entities_count: {
      group_name: 'Entités dans la base',
      books: 'Livres',
      book_papers: 'Papiers',
      book_electronics: 'Epubs',
      book_audios: 'Audios',
      authors: 'Auteurs',
      api_error: 'La récupération des statistiques des auteurs et des livres a échoué'
    }
  },
  authors: {
    group_bibliography: {
      select_book_type_options: {
        none: 'Tous',
        paper_book: 'Papier',
        electronic_book: 'Epub',
        audio_book: 'Audio'
      }
    }
  },
  reference_groups: {
    entity_layout: {
      group_information: 'Informations',
      group_books: 'Livres'
    },
    errors: {
      undefined_book_title: 'Erreur: titre non définit'
    },
    comment: 'Description',
    the_reference_group: 'Le groupe',
    remove_element: {
      popup: {
        header: 'Confirmez la suppression du livre',
        body: 'Voulez-vous vraiment enlever le livre "{bookTitle}" du groupe "{groupComment}"? Cette action est définitive.',
        action: {
          cancel: 'Annuler',
          remove: 'Enlever'
        }
      },
      success: 'Le livre a été enlevé du groupe'
    }
  },
  books: {
    list: {
      download_book_button_label: 'Télécharger le livre',
      download_book_error: 'Une erreur est survenue lors du téléchargement du livre'
    }
  }
}
