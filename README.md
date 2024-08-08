# engagejs

### Directory structure
1. `quarto_src`: Contains the quarto qmd files to generate the website htmls. (Edit files here to change how the website looks etc)
2. `docs`: This is where the quarto files are rendered and served over the website. (Do NOT edit this directly, issuing `quarto render` in the `quarto_src` directory generates files here)
3. `core`: Contains code for the core functionality of engage (i.e. templates for simulations etc) 
4. `sims/explore`: Contains simulations for exploration (not incremental, for visuals only).
5. `sims/play`: Contains more game-y simulatons
6. `sims/learn`: Contains more pedagogically oriented simulations.

### Design fundamentals
1. Colors
    a. Light mode: 
       text: #0e0606
       background: #ffffff
       primary: #b8515f
       secondary: #a4dad7
       accent: #7a84c7
    b. Dark mode: 
       text: #f9f1f1
       background: #000000
       primary: #ae4755
       secondary: #255b58
       accent: #384285
2. Fonts
    Headings: 
    Body: 
