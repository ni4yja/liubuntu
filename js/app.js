const { createApp, ref, computed, onMounted } = Vue;

createApp({
  setup() {
    const TYPE_ORDER = ["culture", "tech", "stories", "impact"];
    const entries = ref([]);
    const activeType = ref("all");
    sortDirection = ref("desc");

    const entryTypes = computed(() => {
      return TYPE_ORDER.filter(type =>
        entries.value.some(e => e.entry_type === type)
      );
    });

    const filteredEntries = computed(() => {
      let result = [...entries.value];

      if (activeType.value !== "all") {
        result = result.filter(
          e => e.entry_type === activeType.value
        );
      }

      return result.sort((a, b) => {
        const dateA = new Date(a.start_date);
        const dateB = new Date(b.start_date);

        return sortDirection.value === "desc"
          ? dateB - dateA
          : dateA - dateB;
      });
    });

    const toggleOrder = () => {
      sortDirection.value =
        sortDirection.value === "desc" ? "asc" : "desc";
    };

    const formatDateRange = (entry) => {
      if (!entry.start_date) return "";

      const startYear = new Date(entry.start_date).getFullYear();

      if (entry.is_ongoing) {
        return `${startYear} — ongoing`;
      }

      if (entry.end_date) {
        const endYear = new Date(entry.end_date).getFullYear();

        if (startYear === endYear) {
          return `${startYear}`;
        }

        return `${startYear} — ${endYear}`;
      }

      return `${startYear}`;
    };

    onMounted(async () => {
      const response = await fetch("data/entries.json");
      entries.value = await response.json();
    });

    return {
      entries,
      sortDirection,
      toggleOrder,
      formatDateRange,
      activeType,
      entryTypes,
      filteredEntries,
    };
  }
}).mount("#app");
