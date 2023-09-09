Title: Book summary: Refactoring UI
Date: 2023-09-09 17:56
Tags: best practices, books, design, refactoring, ui
Slug: book-summary-refactoring-ui
Authors: Sébastien Lavoie
Summary: [Refactoring UI](https://www.refactoringui.com/) provides guidance for non-designers on how to create polished, professional visual interfaces without formal graphic design skills.
Description: Refactoring UI provides guidance for non-designers on how to create polished, professional visual interfaces without formal graphic design skills.

[TOC]

---

# Introduction

- It covers core principles like establishing consistent systems for recurring elements such as spacing and typography.
- It advises generous use of white space and thoughtful visual hierarchy.
- Steps for adding depth through lighting, shadows, and layers are outlined.
- Recommendations are provided for working with images and illustrations effectively.
- Tips on elevating default elements and breaking conventions to avoid typical, cookie-cutter designs are included.
- Studying other designers' work and unintuitive decisions is encouraged to expand one's skills.
- The goal is to equip readers with knowledge to thoughtfully craft interfaces that appear purposefully designed without simply mimicking common graphical tropes.
- By learning fundamental visual design concepts tailored to user interfaces, anyone can create clean, functional, and visually engaging digital experiences.

---

# Starting from scratch

- **Start with a feature, not a layout**
    - Design the shell and navigation later once you know what features you need.
- **Detail comes later**
    - Design with a big sharpie.
    - Design in grayscale to use spacing, contrast and size to do the heavy lifting.
- **Don't over-invest**
    - Go with low-fidelity sketches and wireframes first to move fast. Don't get bogged down with details like fonts and colors early on.
- **Don't design too much**
    - **Work in cycles**: design a feature simply, build it, fix errors.
    - **Be a pessimist**: expect it to be hard to build, and postpone building it (e.g., commenting system without attachments at first).

## Choose a personality

- Font choice
    - *Elegant/classic*: serif
    - *Playful*: Sans-serif
    - *Plain*: neutral sans-serif
- Color
    - Blue: safe and familiar, good overall pick.
    - Gold: expensive, sophisticated.
    - Pink: more fun, less serious.
- Border radius
    - *Small* -- neutral, not much personality.
    - *Large* -- more playful.
    - *None* -- more serious/formal.
    - **Stay consistent** -- either rounded or not, same everywhere.
- Language
    - Choose the right words for the desired tone.
- Decide what you actually want
    - Look at the websites your expected customers use? Serious, then that's the feel. Playful? Then that.

## Limit your choices

- **Define systems in advance**
    - Have a working palette color and limit yourself to it.
    - Use a type scale to avoid picking specific font sizes.
- Designing by process of elimination.
- **Systematize** as much as possible to avoid repetitive low-level decisions.

---

# Hierarchy

- Visual hierarchy refers to how elements appear in importance relative to one another.
- Don't let HTML semantics dictate visual styling -- style based on visual hierarchy.
- Size isn't everything. Bold font communicates importance. *De-emphasize* secondary/tertiary information to highlight the most important elements.
- Rely on *font weight* and *color*, not just font size, to create hierarchy.
- Limit yourself to *2-3 colors* and font weights to define hierarchy.
- On colored backgrounds, pick a color with similar hue but lower saturation/lightness rather than just making text gray.
- **Avoid label**: value formats -- use formats, context, and combined labels/values for clarity without labels.
- Treat labels as secondary content when needed -- smaller, lower contrast, lighter weight.
- De-emphasize competing elements instead of just emphasizing the key element.
- *Combine labels and values*: e.g., instead of "*In stock: 12*", use "*12 left in stock*".
- Treat labels as supporting content.
- Design buttons based on hierarchy, not just semantics. Primary/destructive actions don't always need prominence.

---

# Layout and spacing

- **Start with too much white space**, then remove until happy -- often ends up being "just enough".
- Compact layouts have their place but should be a deliberate choice, not the default.
- **Establish a spacing and sizing system**
    - A linear scale won't work
    - Create a constrained spacing/sizing system based on a base unit (like `16px`) to work faster with more consistency.
- *Don't feel the need to fill the whole screen* -- give elements only the space they need.
- **Grids are overrated**
    - Not all elements should be fluid
    - Don't shrink an element until you need to.
    - Grids can bring order but don't have to dictate every layout decision.
- *Balance layouts in columns* instead of just making things wider.
- *Relative sizing doesn't scale*.
    - Fix element widths when flexibility isn't needed.
    - Scale elements independently -- don't rely on relative units like `em`.
- **Avoid ambiguous spacing**: increase spacing between groups and reduce spacing within groups to show relationships.

---

# Text

- **Establish a constrained type scale** to speed up font size decisions and add consistency. Avoid strict modular scales.
- Use *pixel* or `rem` units -- not `em` -- to guarantee sizes match the scale.
- For UI design, *pick scale values by hand* instead of using a mathematical ratio.
- **Use high quality fonts** -- safe bets are neutral sans-serifs and system fonts.
- Use the system stack if not sure: `-apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue;`
- Favor fonts with *5+ weights* and optimized for legibility.
- **Keep line length between 45-75 characters** (20-35 `em`) for optimal readability.
- **Align mixed font sizes by their baselines**, not centers.
- Use taller line-heights for small text and shorter line-heights for large text.
- Subtly emphasize links in UIs, no need for high contrast colors.
- Left align most text, right align numbers in tables. Justify only with hyphenation.
- Don't center long form text.
- Tighten letter-spacing for headlines set in text faces. Loosen letter-spacing for all-caps.
- Not all links need to be emphasized boldly, especially in UIs where there is plenty of interactivity.

---

# Colors

- **HSL** (*hue*, *saturation*, *lightness*) is more intuitive to the human eye: use it instead of **HEX** and **RGB**.
    - *Hue* is the color position on the color wheel. 0° is red, 120° is green, and 240° is blue.
    - *Saturation* represents the vividness. 0% is grey while 100% is vibrant and intense.
    - *Lightness* measures how close a closer is to black (0%) or white (100%), where 50% is the pure color.
- **HSL** is not the same as **HSB** (`lightness != brightness`). In **HSB**, 0% brightness is always black but 100% brightness is white when saturation is set to 0%.
    - With 100% saturation in both HSL and HSB, 100% brightness is equivalent to 50% lightness (pure color).
- *Don't rely solely on color to convey information* - support it with other indicators.

## A good color palette

- You need more colors than you think - aim for *10+ shades* of *greys*, *primary colors*, and *accent colors*.
- *Grey*
    - There is a lot of grey in UIs: between *8-10 shades of grey* is a good array of options to pick from. Use very dark grey instead of true black so it looks more natural.
- *Primary colors*
    - *1 or 2 is great, with 5-10 different shades* (e.g., Facebook is basically blue). A very light shade is good for a tinted background (e.g., alerts), darker shades work great for text.
- *Accent colors*
    - *Use sparingly*.
    - Needed to bring *semantic meaning*, such as red for danger, yellow for warnings and green for positive trends.
    - For a complex UI, can be as many as 10 different colors, each with 5-10 shades.

## Building a color palette

- Define color shades upfront instead of generating on the fly. Pick base, darkest, lightest, then fill in gaps.
- Don't rely purely on math to generate shades - trust your eyes and tweak if needed.
- Choose the base color first. This is the color in the middle that light and dark shades are derived from.
- Center: pick a shade that would work well as a button background.
- Extremes: pick the lightness color to work as a background and the darkest to work on top as text to get enough contrast.
- Repeat the process to pick the remaining colors in between. *9 shades is a good sweet spot as it divides cleanly*.
- For grays, the base color doesn't matter nearly as much: same process.

## Perceived brightness

- In the HSL system, the further away a color is from 50% lightness, the more saturated it should be so it doesn't look washed out.
- The perceived brightness of a color to the human eye can be calculated as follows:

$$\frac{{\sqrt{0.299 r^2 + 0.587 g^2 + 0.114 b^2}}}{255}$$

- Green is perceived as more bright than red, which in turn is perceived as more bright than blue. With this data point, we can tweak the perceived brightness of a color by rotating the color wheel towards the desired perceived brightness.
- *Grays aren't usually totally desaturated*.
    - To make them feel "*cool*" saturate them with some blue.
    - To make them feel "*warm*", saturate them with yellow or orange.
    - The same "*saturation curve*" applies to grays: the further away from 50% brightness, the more they should be saturated to avoid looking washed out.

## A word on accessibility

- Instead of having elements like dark-colored pills with a white foreground color, flip the contrast by having light-colored pills with a dark version of the color in the foreground so they won't grab too much attention.
- **Rotate the hue to make the color pop more**. For instance, instead of cranking up the lightness to meet ideal contrast ratios, rotate the hue and possibly keep the saturation high for a vibrant contrast.
- **Don't rely on color alone**
    - Add visual cues (like arrows for upward/downward trends). Designing in grayscale first will help spot these kinds of issues.
    - For things like a graph, playing with contrast will produce clearer results.

---

# Depth

- Mimic how light works in the real world.
    - Emulate a light source coming from above to make elements appear raised or inset.
    - For instance, with a button, if light comes from above, then the top should be lighter (e.g., `box-shadow inset`) than the bottom (`box-shadow`, casting shadow only below).
    - For elements that are "inset" (I.e., more depth in the center), the opposite effect should happen: more light reaches the bottom part (vertical `box-shadow`, going up) than the top part (`box-shadow inset` such that it casts some shadow towards the bottom).
- *Don't overdo it*.

---

## Shadows

- *Use shadows to convey elevation*
    - When something appears to be raised from the background (e.g., bigger `drop-shadow`), *it attracts the user's focus*.
    - *Small shadows* are useful to attract attention to the primary action to be performed.
    - *Medium shadows* are useful for things like a dropdown so it looks separate from the background.
    - *Large shadows* are great for modals.
    - *5 options* is usually plenty.
    - Can be used for interactivity, like when dragging a row from a table.
    - A button can feel like it's being "pressed" by reducing its shadow on click (i.e., it gets closer to the page or farther away from the user).
    - Casting shadows
        - To simulate a shadow cast by *direct light* (e.g., a long shadow behind a plant getting some sunlight), use a larger, more diffuse and subtle shadow.
        - To simulate a shadow cast by *ambient light* (e.g., the shadow right below the plant's pot where light can't hardly reach), use a narrow and darker shadow.
        - Apply both types of shadow casting at once to create visually compelling effects.
- Define a fixed set of shadows as an elevation system for consistency.
- Even flat designs can have depth
    - Flat design does not convey depth with shadows and gradients.
    - Create depth with color: lighter colors feel closer.
    - Can use short, offset shadows with no blur at all.
- Overlap elements to create layers
    - E.g., position a block with a negative margin so it appears on top of two different sections.
    - For smaller elements like avatars, an invisible border around it can make it pop better.

---

# Images and contrast

- Images
    - *Use high quality photos* - hire a pro or use stock sites for generics. Don't expect good results from phone pics.
- **Text needs consistent contrast**
    - Add an overlay to background images to get readable headlines.
    - Lower the image contrast. Adjust the brightness to compensate.
    - Colorize the image with a single color.
    - Use text shadows instead of overlays to preserve image dynamics.

---

# Scale

- **Don't scale up icons**
- Even for SVGs, they will lack detail if they were designed correctly at a smaller scale: use a more detailed icon instead.
- If updating the icon is not an option, enclose it inside another shape (e.g., a circle with a background color) to occupy more space.
- **Don't scale down screenshots**
- Details will be distorted and hard to read.
- Either use a presentation from a smaller device (e.g., the tablet version on a desktop) or take a partial screenshot (e.g., "zoom in" effect with a circle or simply crop the original image).
- If a more complex UI needs to be presented, simplify the original image so the user doesn't try to read a 4px font size but instead sees simpler shapes.
- **Don't scale down icons**
- E.g. for a favicon, redraw a simplified version instead: details will look fuzzy at a small size.
- User-submitted content (e.g., Instagram feed)
- *Control the size and shape*: crop images to keep the aspect ratio of containers  so they don't disturb layout (e.g., background-size: cover).
- Add inner shadows or borders to user images to prevent background bleed.

---

# Finishing touches

- Use icons instead of bullets in a bulleted list.
- Play with size and colors. E.g., you can have huge quotes around the block of text representing a testimonial.
- Links deserve special styling.
- Use custom checkboxes and radio buttons in forms: integrate the brand's primary color(s).
- Add color with accent borders, e.g. across the top of a card element, when highlighting active elements in the UI or to the left of alert messages.
- *Decorate backgrounds*
    - Change the background color. Works great for different page sections.
    - Can use gradients: use two hues that are within 30˚ of each other.
    - Use repeating patterns.
- **Consider the empty state carefully**, especially when the user is meant to fill the UI with data.
    - Prioritize empty states with illustrations and clear calls to action.
    - I.e., a contact page with no contacts should feel welcoming, with some icon and button to add a contact instead of a blank page with an error-like statement.
    - Similarly, things like dashboard may present a bunch of options that won't apply until there is something to show: simplify the user experience.
- **Use less borders**
    - Use box shadows, spacing, and color instead of borders to distinguish elements.
    - Have two background colors for containers (e.g., darker footer that looks separate from the main content).
    - Replace borders with additional spacing.
- *Make components more exciting*
    - E.g., a table  may not need all its columns if a particular column does not need to be sorted and could instead be part of another one (e.g., combining a dollar amount with a plan type or a person's name with its title).
    - Radio buttons could be cards instead if they are an important part of the UI.

---

# Next level

- Look for unintuitive decisions in designs you admire to find new ideas.
- Rebuild interfaces you love to discover small details that make them exceptional.
- Study others to build a solid foundation.

---

# Conclusion

The concepts covered in this book demonstrate that effective visual design does not require innate artistic talent or formal training. By approaching interfaces methodically, establishing constraints through systems for recurring elements, and learning to strategically apply principles like visual hierarchy, white space, and depth cues, anyone can create designs that appear polished and purposeful. While internalizing these fundamentals does take practice, the ideas presented remove much of the subjective, nuanced expertise needed for things like picking complementary colors or balancing composition in illustrations.

By focusing on interfaces rather than free-form graphical work, the required skills become more structured and intentional choices drive outcomes. While studying formally can provide more breadth, the core principles in this text are enough to equip non-designers with the ability to build clean, intuitive, and aesthetically pleasing digital products. By implementing the recommendations covered, engineers and others new to design can gain confidence in their interface design skills. A great, concise read!
