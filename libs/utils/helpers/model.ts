function model(data: any, label: string, value: string) {
    if (data) {
      let newArray = data?.data?.map((item: any) => {
        return {
          label: item[label],
          value: item[value],
          ...item,
        };
      });
      return newArray;
    }
  }
  
  export default model;