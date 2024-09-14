# Admin Panel for Meeting Management

Project Overview: Developed an Admin Panel for managing meetings using ReactJS with class-based components. The panel features role-based access control, dynamic data presentation, and integrated mapping functionality.

Key Features:

Role-Based Access Control:

Implemented tailored access privileges for different roles:
  Super Admin: Full access to all functionalities.
  Admin: Restricted access to certain features.
  Back Office: Specific page access and limited functionalities.
  
State Management:
  Utilized Redux for efficient state management and to ensure consistent availability of user login data across the application.
  
Data Presentation:
  Employed MuiDataTables for displaying data with:
  Integrated pagination for clear and organized listings.
  Dynamic sorting and filtering options.

Component Reusability:
  Adhered to the DRY (Don't Repeat Yourself) principle, maximizing component reusability and maintainability.
  
UI Design and Layout:
  Utilized Material-UI (Mui) components and Mui Grid for a consistent and responsive design.
  Styled components to ensure a cohesive look and feel throughout the application.
  
Mapping Integration:
  Integrated Google Maps to display office locations.
  Implemented custom markers representing office coordinates.
  Enabled marker click functionality to display detailed office information.
  
Access Control and Functionalities:
  Assigned specific page access and functionalities based on user roles.
  Ensured that the Back Office had tailored access and functionalities, while Super Admins had additional capabilities.
