import {PublishingApi} from "../infrastructure/publishing-api.js";
import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {CategoryAssembler} from "../infrastructure/category.assembler.js";
import {TutorialAssembler} from "../infrastructure/tutorial.assembler.js";

const publishingApi = new PublishingApi();

const usePublishingStore = defineStore('publishing', () => {
    // State
    const categories = ref([]);
    const tutorials = ref([]);
    const errors = ref([]);
    const categoriesLoaded = ref(false);
    const tutorialsLoaded = ref(false);
    // Getters
    const categoriesCount = computed(() => categoriesLoaded ? categories.value.length : 0);
    const tutorialsCount = computed(() => tutorialsLoaded ? tutorials.value.length : 0);
    // Actions
    function fetchCategories() {
        publishingApi.getCategories().then(response => {
            categories.value = CategoryAssembler.toEntitiesFromResponse(response);
            categoriesLoaded.value = true;
            console.log(categoriesLoaded.value);
            console.log(categories.value);
        }).catch(error => {
            errors.value.push(error);
            categories.value = [];
        });
    }

    function fetchTutorials() {
        publishingApi.getTutorials().then(response => {
            tutorials.value = TutorialAssembler.toEntitiesFromResponse(response);
            tutorialsLoaded.value = true;
        }).catch(error => {
            errors.value.push(error);
            tutorials.value = [];
        });
    }

    function addCategory(category) {
        publishingApi.createCategory(category).then(response => {
            const resource = response.data;
            const newCategory = CategoryAssembler.toEntityFromResource(resource);
            categories.value.push(newCategory);
        }).catch(error => {
            errors.value.push(error);
        })
    }

    function updateCategory(category) {
        publishingApi.updateCategory(category).then(response => {
            const resource = response.data;
            const updatedCategory = CategoryAssembler.toEntityFromResource(resource);
            const index = categories.value.findIndex(c => c["id"] === updatedCategory.id);
            if (index !== -1) categories.value[index] = updatedCategory;
        }).catch(error => {
            errors.value.push(error);
        });
    }

    function deleteCategory(category) {
        publishingApi.deleteCategory(category.id).then(() => {
            const index = categories.value.findIndex(c => c["id"] === category.id);
            if (index !== -1) categories.value.splice(index, 1);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    function addTutorial(tutorial) {
        publishingApi.createTutorial(tutorial).then(response => {
            const resource = response.data;
            const newTutorial = TutorialAssembler.toEntityFromResource(resource);
            tutorials.value.push(newTutorial);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    function updateTutorial(tutorial) {
        publishingApi.updateTutorial(tutorial).then(response => {
            const resource = response.data;
            const updatedTutorial = TutorialAssembler.toEntityFromResource(resource);
            const index = tutorials.value.findIndex(t => t["id"] === updatedTutorial.id);
            if (index !== -1) tutorials.value[index] = updatedTutorial;
        }).catch(error => {
            errors.value.push(error);
        });
    }

    function deleteTutorial(tutorial) {
        publishingApi.deleteTutorial(tutorial.id).then(() => {
            const index = tutorials.value.findIndex(t => t["id"] === tutorial.id);
            if (index !== -1) tutorials.value.splice(index, 1);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    function getCategoryById(id) {
        return categories.value.find(category => category["id"] === id);
    }

    function getTutorialById(id) {
        return tutorials.value.find(tutorial => tutorial["id"] === id);
    }

    return {
        // State
        categories,
        tutorials,
        errors,
        categoriesLoaded,
        tutorialsLoaded,
        // Getters
        categoriesCount,
        tutorialsCount,
        // Actions
        fetchCategories,
        fetchTutorials,
        addCategory,
        updateCategory,
        deleteCategory,
        addTutorial,
        updateTutorial,
        deleteTutorial,
        getCategoryById,
        getTutorialById
    }
});

export default usePublishingStore;