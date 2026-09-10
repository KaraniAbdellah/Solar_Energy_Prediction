## Project Overview
I am building a React and Tailwind CSS.


## Project Structure
**Description:** I am using this structre, Here is an example of the code structure:
**FrontEnd:**
src/
- features/
  - [feature-name]/
    - components/   (reusable UI components for this feature)
    - services/     (API calls or business logic)
    - utils/        (helper functions)
    - constants/    (constants used in this feature like (INIT_THEME, ...)
    - styles/       (SomeTime we need CSS styles for this feature. if tailwind is not enough)
- global/           (global contexts and types)
  - context/        (global React context)

## Plans:
- Keep plans extremely concise. Prioritize brevity and clarity over complete sentences.
- At the end of each plan, list unresolved questions that require user input. If none, write "None."



## Strict Rules
- **Styling:**
  - Use Tailwind CSS or a similar utility-first CSS framework.
- **Error Handling:** 
  - use try/catch for error handling.
  - display a simple message to the user in case of an error.
  - use **react-hot-toast** for error messages.
- **Simplicity & Clean Code:** 
  - Keep files small
  - Separate UI code (what it looks like) from logic (what it does).
  - Avoid code duplication. Write reusable components.
- **Performance Best Practices:**
  - Lazy-load pages: Don't load every page when the application starts.
  - Avoid unnecessary re-renders. Use `React.memo`, `useMemo`, or `useCallback` when a component handles heavy data or lists.
  - Use lazy loading for heavy page components.
  - Use useCallback when passing functions to memoized components
  - Virtualize large lists
  - Use pagination in fetching large lists and data.
  - Use `React.memo` and `useMemo` to avoid unnecessary re-renders.
- **No New Libraries:** Do not install any new third-party packages.
- **Do not Hardcode:**
  - Do not hardcode values or strings in the code. Use environment variables or configuration files instead.
- **If you don't know how to do something, ask me for help**