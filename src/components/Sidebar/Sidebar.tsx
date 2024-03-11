import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-data">
        <DataItem name="data1" />
        <DataItem name="data2" />
        <DataItem name="data3" />
        <DataItem name="data4" />
      </div>
    </div>
  );
};

export default Sidebar;

interface DataItemProps {
  name: string;
}
const DataItem = ({ name }: DataItemProps) => {
  const onDragStart = (event: React.DragEvent<HTMLSpanElement>, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };
  return (
    <span className="data-circle" draggable onDragStart={(event) => onDragStart(event, name)}>
      {name}
    </span>
  );
};
