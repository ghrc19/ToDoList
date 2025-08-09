import React from 'react';
import TaskList from '../components/tasks/TaskList';
const Dashboard: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <TaskList />
    </div>
  );
};
export default Dashboard;