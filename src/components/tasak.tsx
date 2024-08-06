/* eslint-disable @typescript-eslint/no-explicit-any */
import { TimeOutline } from "react-ionicons";
// import { TaskT } from "../../types";

// interface TaskProps {
//   task: TaskT;
//   provided: any;
// }

const Task = ({ task, provided }: any) => {
  const { title, description, priority, deadline, image, alt, tags } = task;

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="flex w-full cursor-grab flex-col items-start justify-between gap-3 rounded-xl bg-[#fff] px-3 py-4 shadow-sm"
    >
      {image && alt && (
        <img src={image} alt={alt} className="h-[170px] w-full rounded-lg" />
      )}
      <div className="flex items-center gap-2">
        {tags.map((tag) => (
          <span
            key={tag.title}
            className="rounded-md px-[10px] py-[2px] text-[13px] font-medium"
            style={{ backgroundColor: tag.bg, color: tag.text }}
          >
            {tag.title}
          </span>
        ))}
      </div>
      <div className="flex w-full flex-col items-start gap-0">
        <span className="text-[15.5px] font-medium text-[#555]">{title}</span>
        <span className="text-[13.5px] text-gray-500">{description}</span>
      </div>
      <div className="w-full border border-dashed"></div>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-1">
          {/* <TimeOutline color={"#666"} width="19px" height="19px" /> */}
          <span className="text-[13px] text-gray-700">{deadline} mins</span>
        </div>
        <div
          className={`h-[5px] w-[60px] rounded-full ${
            priority === "high"
              ? "bg-red-500"
              : priority === "medium"
                ? "bg-orange-500"
                : "bg-blue-500"
          }`}
        ></div>
      </div>
    </div>
  );
};

export default Task;
