<template>
  <div id="book-list" :class="{ withPopupOpened: bookToDeleteDisplayPopup }">
    <List
      ref="list"
      api-endpoint="/books"
      :cols="cols"
      :left-action-bar-properties="leftActionBarProperties"
      details-component-path="book/BookListRowDetails.vue"
      :callback="setBook"
      name="book"
    />
    <BookListPopupDelete
      v-if="bookToDeleteDisplayPopup"
      :book-title="bookToDeleteBookTitle"
      @book-delete-cancel="bookDeleteCancel"
      @book-delete-trigger="bookDeleteTrigger"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { container } from "tsyringe";
import Column from "assets/ts/list/Column";
import DataSubProperty from "assets/ts/list/DataSubProperty";
import LeftActionBarElement from "assets/ts/list/LeftActionBarElement";
import LeftActionBarProperties from "assets/ts/list/LeftActionBarProperties";
import BookService from "assets/ts/service/BookService";
import bookElectronicModule from "assets/ts/store/book/BookElectronicModule";
import bookAudioModule from "~/assets/ts/store/book/BookAudioModule";
import LeftActionBarSeparatorDescriptor from "assets/ts/list/LeftActionBarSeparatorDescriptor";
import List from "~/components/list/List.vue";
import LeftActionBarLinkDescriptor from "assets/ts/list/LeftActionBarLinkDescriptor";
import { BookPaperItem } from "~/assets/ts/models/BookPaper";
import { BookElectronicItem } from "~/assets/ts/models/BookElectronic";
import BookListPopupDelete from "~/components/book/BookListPopupDelete.vue";
import BookStoreService from "~/assets/ts/service/BookStoreService";
import { BookAudioItem } from "~/assets/ts/models/BookAudio";
import MedSelectDescriptor, {
  SelectValue,
} from "~/assets/ts/form/MedSelectDescriptor";
import UserService from "~/assets/ts/service/UserService";
import bookListModule from "~/assets/ts/store/list/BookListModule";
import { useRuntimeConfig } from "#app";

const config = useRuntimeConfig();
const router = useRouter();
const bookService = container.resolve(BookService);

const cols = [
  new Column("title", "Titre"),
  new Column("year", "Année"),
  new Column("language", "Langue"),
  new Column("authors", "Auteurs")
    .setSearchParameterName("authorFullname")
    .setIsSortable(false)
    .setSubProperties([
      new DataSubProperty("person", [
        new DataSubProperty("firstname"),
        new DataSubProperty("lastname"),
      ]),
    ]),
];

const leftActionBarProperties = new LeftActionBarProperties(
  [
    new LeftActionBarElement(
      "separator",
      () => null,
      new LeftActionBarSeparatorDescriptor("add")
        .setLabel("Ajouter")
        .setFaIcon("fas fa-plus")
    ),
    new LeftActionBarElement(
      "element",
      () => null,
      new LeftActionBarLinkDescriptor(
        "addPaper",
        "Livre papier",
        "/book/paper"
      ).setFaIcon("fas fa-scroll")
    ),
    new LeftActionBarElement(
      "element",
      () => null,
      new LeftActionBarLinkDescriptor(
        "addElectronic",
        "Epub",
        "/book/electronic/upload"
      ).setFaIcon("fas fa-tablet-alt")
    ),
    new LeftActionBarElement(
      "element",
      () => null,
      new LeftActionBarLinkDescriptor(
        "addAudio",
        "Audio",
        "/book/audio"
      ).setFaIcon("fas fa-music")
    ),
    new LeftActionBarElement(
      "separator",
      () => null,
      new LeftActionBarSeparatorDescriptor("filters")
        .setLabel("Filtres")
        .setFaIcon("fas fa-sliders-h")
    ),
    new LeftActionBarElement(
      "filter",
      () => null,
      new MedSelectDescriptor("bookType")
        .setOptions([
          {
            label: "Tous",
            key: "all",
            value: "all",
            default: true,
          },
          {
            label: "Papier",
            key: "paper",
            value: "paper",
          },
          {
            label: "Epub",
            key: "electronic",
            value: "electronic",
          },
          {
            label: "Audio",
            key: "audio",
            value: "audio",
          },
        ])
        .setFaIcon("fas fa-book")
    ),
    new LeftActionBarElement(
      "filter",
      () => null,
      new MedSelectDescriptor("owner")
        .setOptions(
          container
            .resolve(UserService)
            .getUsers()
            .then((data) => {
              const options: SelectValue[] = data["hydra:member"]
                .map((user) => {
                  return {
                    key: user.id?.toString() ?? "",
                    value: user.id,
                    label: user.firstname + " " + user.lastname,
                  };
                })
                .sort((first, second) =>
                  first.label.localeCompare(second.label)
                );

              options.unshift({
                key: "all",
                value: null,
                label: "Tous",
                default: true,
              });

              return options;
            })
        )
        .setFaIcon("fas fa-user")
    ),
  ],
  false
);

const bookToDeleteDisplayPopup = ref(false);

const setBook = (
  selectedBook: BookPaperItem | BookElectronicItem | BookAudioItem
) => {
  window.location.href = bookService.getBookUrl(selectedBook);
};

const bookDeleteCancel = () => {
  bookListModule.setBookToDelete(null);
};

const bookDeleteTrigger = () => {
  if (bookListModule.bookToDelete === null) {
    return;
  }
  const bookStore = new BookStoreService().getStore(
    bookListModule.bookToDelete
  );
  bookStore.setBook(bookListModule.bookToDelete);
  bookStore
    .deleteBook()
    .then(() => {
      bookListModule.setBookToDelete(null);
    })
    .catch((error: Error) => {
      console.error("Erreur lors de la suppression du livre:", error);
    });
};

const bookToDeleteBookTitle = computed(
  () => bookListModule.bookToDelete?.title
);

const bookToDelete = computed(() => bookListModule.bookToDelete);

const bookToDownload = computed(() => bookListModule.bookToDownload);

watch(bookToDelete, () => {
  bookToDeleteDisplayPopup.value = bookListModule.bookToDelete !== null;
});

watch(bookToDownload, () => {
  if (bookToDownload.value === null || !bookToDownload.value.id) {
    return;
  }

  const downloadErrorHandler = (err: Error) => {
    console.error("Erreur lors du téléchargement du livre:", err);
  };

  switch (bookToDownload.value["@type"]) {
    case BookService.bookElectronic:
      bookElectronicModule
        .get(bookToDownload.value.id)
        .then(() => bookElectronicModule.downloadEbook())
        .catch((err: Error) => {
          downloadErrorHandler(err);
        })
        .finally(() => bookElectronicModule.init());
      break;
    case BookService.bookAudio:
      bookAudioModule
        .get(bookToDownload.value.id)
        .then(() => bookAudioModule.downloadBookFile())
        .catch((err: Error) => {
          downloadErrorHandler(err);
        })
        .finally(() => bookAudioModule.init());
      break;
    default:
      downloadErrorHandler(
        new Error(
          "Cannot download books of type " + bookToDownload.value["@type"]
        )
      );
  }
});
</script>

<style lang="scss">
#book-list {
  position: relative;

  &.withPopupOpened #vueListContainer {
    filter: blur(8px);
  }
}
</style>
