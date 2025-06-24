interface CourseData {
    data: Course[];
}
  
  interface Course {
    id: string;
    courseName: string;
    description: string;
    status: boolean;
    dateCreated: string;
    dateUpdated: string;
  }
  
  function courseModel(data: any): { label: string; value: string }[] {
    // if (data) {
    //     let newArray = data?.data?.map((course: Course) => {
    //       return {
    //         label: course.courseName,
    //         value: course.id,
    //         ...course,
    //       }
    //     });
    //     console.log(newArray)
    //     return newArray;
    // }
    if (data && data.data) {
        return data.data.map((course: Course) => ({
            label: course.courseName,
            value: course.id,
        }));
    }
    return [];
  }
  
  export default courseModel;