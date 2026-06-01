export type filtersProps = {
  search: string;
  categoryId: string;
  page: number;
  limit: number;
};

export type DataProps = {
  filters: filtersProps;
  setFilters: React.Dispatch<React.SetStateAction<filtersProps>>;
  loading: boolean;
};
