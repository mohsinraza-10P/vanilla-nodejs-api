var projects = require('./data-store');

const getAllProjects = () => {
  return new Promise((resolve, reject) => resolve(projects));
};

const getProject = (id) => {
  return new Promise((resolve, reject) => {
    const item = projects.find((p) => p.id === parseInt(id));
    if (item) {
      resolve(item);
      return;
    }
    reject(`No project found with id: ${id}`);
  });
};

const createProject = (project) => {
  return new Promise((resolve, reject) => {
    // Data validation
    if (!project || !project.id || !project.name) {
      reject('Not a valid JSON body request. Must include fields [id, name]');
      return;
    }

    // Duplicate record insertion validation
    const { exists } = projectExists(project.id);
    if (exists) {
      reject(`Duplicate project found with id: ${project.id}`);
      return;
    }

    // Record insertion success
    projects.push(project);
    resolve(projects);
  });
};

const updateProject = (id, project) => {
  return new Promise((resolve, reject) => {
    const { exists, index } = projectExists(id);
    if (!exists) {
      reject(`No project exists with id: ${id}`);
      return;
    }

    const updates = Object.keys(project);
    const allowedKeys = ['name'];
    const isValidKey = updates.every((key) => allowedKeys.includes(key));
    if (!isValidKey) {
      reject('Invalid field inclusion. Allowed field(s) are: ' + allowedKeys);
      return;
    }

    projects[index].name = project.name;
    resolve(projects[index]);
  });
};

const deleteProject = (id) => {
  return new Promise((resolve, reject) => {
    const { exists, index } = projectExists(id);
    if (!exists) {
      reject(`No project exists with id: ${id}`);
      return;
    }

    const deletedProject = projects.splice(index, 1)[0];
    resolve(deletedProject);
  });
};

const projectExists = (id) => {
  const index = projects.findIndex((p) => p.id === parseInt(id));
  return { exists: index >= 0, index };
};

module.exports = {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
};
