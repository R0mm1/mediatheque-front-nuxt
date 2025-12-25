<template>
  <div id="page_book_electronic_upload">
    <FormContainer>
      <template #form_title> Télécharger un fichier epub </template>

      <template #form_body>
        <template v-if="!isFileLoading">
          <MedInputButton
            :button-descriptor="uploadButtonDescriptor"
            @click="openFileDialog"
          />
          <MedInputCheckbox
            v-model="doAnalyze"
            :checkbox-descriptor="checkboxDescriptor"
          />
        </template>

        <div v-else-if="isFileLoading" id="form_loader">
          <Loader type="s" />
        </div>

        <input
          ref="inputFile"
          type="file"
          accept="application/epub+zip,application/zip"
          @change="setFile"
        />
      </template>

      <template #action_cancel>
        <span />
      </template>
      <template #action_validate>
        <span />
      </template>
    </FormContainer>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import ButtonDescriptor from "~/assets/ts/form/ButtonDescriptor";
import MedInputButton from "~/components/form/elements/MedInputButton.vue";
import MedInputCheckbox from "~/components/form/elements/MedInputCheckbox.vue";
import CheckboxDescriptor from "~/assets/ts/form/CheckboxDescriptor";
import bookElectronicModule from "~/assets/ts/store/book/BookElectronicModule";
import MedFile from "~/assets/ts/objects/MedFile";
import { ElectronicBookInformation } from "~/assets/ts/models/electronicBookInformation/ElectronicBookInformation";
import { ImageItem } from "~/assets/ts/models/electronicBookInformation/Image";
import FormContainer from "~/components/form/FormContainer.vue";
import Loader from "~/components/widgets/Loader.vue";
import { useRuntimeConfig } from "#app";

const config = useRuntimeConfig();
const router = useRouter();
const inputFile = ref<HTMLInputElement | null>(null);

const uploadButtonDescriptor = new ButtonDescriptor(
  "upload",
  "Choisir le fichier"
).setFaIcon("fas fa-upload");
const checkboxDescriptor = new CheckboxDescriptor(
  "do-analyze",
  "Analyser le livre et en extraire des informations"
);

const doAnalyze = ref(true);
const isFileLoading = ref(false);

const openFileDialog = () => {
  inputFile.value?.click();
};

const showError = (message: string) => {
  console.error(message);
  // TODO: Implement toast notification
};

const setFile = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files === null) {
    return;
  }

  isFileLoading.value = true;
  const file = new MedFile()
    .setFile(input.files[0])
    .setName(input.files[0].name)
    .setIsNew(true);

  if (doAnalyze.value) {
    let electronicBookInformation: ElectronicBookInformation | undefined;
    bookElectronicModule
      .extractInfo(file as { file: File; name: string })
      .then((electronicBookInformationReturned: ElectronicBookInformation) => {
        electronicBookInformation = electronicBookInformationReturned;

        bookElectronicModule.setTitle(electronicBookInformation.title ?? "");

        let createCoverPromise = Promise.resolve();
        const cover: ImageItem | undefined =
          electronicBookInformation.images?.find(
            (image) => image.type === "COVER"
          );
        if (typeof cover !== "undefined") {
          createCoverPromise =
            bookElectronicModule.createCoverFromElectronicBookInformationImage(
              cover
            );
        }

        return Promise.all([
          createCoverPromise,
          bookElectronicModule.createBookFromElectronicBookInformation(
            electronicBookInformation
          ),
        ]);
      })
      .then(() => {
        if (typeof electronicBookInformation === "undefined") {
          throw new TypeError(
            "electronicBookInformation should be defined here"
          );
        }
        return bookElectronicModule.deleteElectronicBookInformation(
          electronicBookInformation
        );
      })
      .then(() => {
        router.push({
          path: "/book/electronic",
          query: {
            init: "false",
          },
        });
      })
      .catch((err: Error) => {
        showError(
          "Une erreur est survenue lors du téléchargement et de l'analyse du livre"
        );
        console.error(err);
      });
  } else {
    bookElectronicModule
      .linkNewFile(file as { file: File; name: string })
      .then(() => {
        router.push({
          path: "/book/electronic",
          query: {
            init: "false",
          },
        });
      })
      .catch((err: Error) => {
        showError("Une erreur est survenue lors du téléchargement du livre");
        console.error(err);
      });
  }
};

// Initialize on mount
bookElectronicModule.init();
</script>

<style scoped lang="scss">
#page_book_electronic_upload {
  display: grid;
  justify-content: center;
  margin: 75px;
}

.med_form {
  max-width: 750px;
}

input[type="file"] {
  display: none;
}

#form_loader img {
  width: 50px;
}
</style>

<style lang="scss">
#page_book_electronic_upload .form_body {
  text-align: center;

  > div:first-of-type {
    margin: 20px 0;
  }
}
</style>
