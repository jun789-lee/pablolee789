# HW Solution: Range of Correlation Coefficient

> **Problem**: Prove that the sample correlation coefficient $r_{XY}$ satisfies $-1 \le r_{XY} \le 1$, and determine the condition for equality.

---

## 1. Proof using Cauchy-Schwarz Inequality

To prove $-1 \le r_{XY} \le 1$, we recall the definition of the correlation coefficient:

$$r_{XY} = \frac{s_{XY}}{s_X s_Y} = \frac{\sum_{i=1}^N (X_i - \bar{X})(Y_i - \bar{Y})}{\sqrt{\sum_{i=1}^N (X_i - \bar{X})^2} \sqrt{\sum_{i=1}^N (Y_i - \bar{Y})^2}}$$

Let us define two vectors $\mathbf{a}$ and $\mathbf{b}$ in $\mathbb{R}^N$:

$$
\mathbf{a} = \begin{pmatrix} X_1 - \bar{X} \\ X_2 - \bar{X} \\ \vdots \\ X_N - \bar{X} \end{pmatrix}, \quad
\mathbf{b} = \begin{pmatrix} Y_1 - \bar{Y} \\ Y_2 - \bar{Y} \\ \vdots \\ Y_N - \bar{Y} \end{pmatrix}
$$

Then, the terms in $r_{XY}$ can be expressed as vector operations:
- **Numerator**: $\mathbf{a} \cdot \mathbf{b} = \sum (X_i - \bar{X})(Y_i - \bar{Y})$
- **Denominator**: $\|\mathbf{a}\| \|\mathbf{b}\| = \sqrt{\sum (X_i - \bar{X})^2} \sqrt{\sum (Y_i - \bar{Y})^2}$

Thus,
$$r_{XY} = \frac{\mathbf{a} \cdot \mathbf{b}}{\|\mathbf{a}\| \|\mathbf{b}\|}$$

### Cauchy-Schwarz Inequality
For any vectors $\mathbf{a}, \mathbf{b} \in \mathbb{R}^N$:
$$|\mathbf{a} \cdot \mathbf{b}| \le \|\mathbf{a}\| \|\mathbf{b}\|$$

Dividing both sides by $\|\mathbf{a}\| \|\mathbf{b}\|$ (assuming variances are non-zero):
$$\frac{|\mathbf{a} \cdot \mathbf{b}|}{\|\mathbf{a}\| \|\mathbf{b}\|} \le 1 \implies |r_{XY}| \le 1$$

Therefore,
$$-1 \le r_{XY} \le 1$$
**(Q.E.D.)**

---

## 2. Condition for Equality

When does $|r_{XY}| = 1$?

The equality in Cauchy-Schwarz holds if and only if **$\mathbf{a}$ and $\mathbf{b}$ are linearly dependent**. That is, one vector is a scalar multiple of the other:

$$\mathbf{b} = c \mathbf{a} \quad (\text{for some scalar } c \neq 0)$$

Substituting the components:
$$Y_i - \bar{Y} = c (X_i - \bar{X})$$

Rearranging for $Y_i$:
$$Y_i = c X_i + (\bar{Y} - c\bar{X})$$

This is the equation of a **straight line** ($Y = cX + \text{intercept}$).

### Case 1: $r_{XY} = 1$
- Requires $\mathbf{a} \cdot \mathbf{b} = \|\mathbf{a}\| \|\mathbf{b}\|$ (positive dot product).
- This implies $c > 0$.
- **Interpretation**: All data points $(X_i, Y_i)$ lie perfectly on a line with **positive slope**.

### Case 2: $r_{XY} = -1$
- Requires $\mathbf{a} \cdot \mathbf{b} = -\|\mathbf{a}\| \|\mathbf{b}\|$ (negative dot product).
- This implies $c < 0$.
- **Interpretation**: All data points $(X_i, Y_i)$ lie perfectly on a line with **negative slope**.

---

## 3. Geometric Interpretation (from Lecture 3)

| Correlation | Condition | Geometric Meaning |
|---|---|---|
| **$r = 1$** | $\mathbf{b} = c\mathbf{a}, c > 0$ | Perfect positive linear relationship |
| **$r = -1$** | $\mathbf{b} = c\mathbf{a}, c < 0$ | Perfect negative linear relationship |
| **$|r| < 1$** | $\mathbf{a}, \mathbf{b}$ not parallel | Scatter plot shows spread around a line |

Using the vector angle $\theta$:
$$r_{XY} = \cos \theta$$

- $r=1 \iff \theta = 0^\circ$ (Vectors are parallel)
- $r=-1 \iff \theta = 180^\circ$ (Vectors are anti-parallel)
- $r=0 \iff \theta = 90^\circ$ (Vectors are orthogonal / uncorrelated)
