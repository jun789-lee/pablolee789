# HW Solution: 상관계수의 범위 증명

> **문제**: 표본상관계수 $r_{XY}$가 $-1 \le r_{XY} \le 1$을 만족함을 증명하고, 등호가 성립할 조건을 구하시오.

---

## 1. 코시-슈바르츠 부등식을 이용한 증명

$-1 \le r_{XY} \le 1$임을 증명하기 위해 상관계수의 정의를 다시 봅시다:

$$r_{XY} = \frac{s_{XY}}{s_X s_Y} = \frac{\sum_{i=1}^N (X_i - \bar{X})(Y_i - \bar{Y})}{\sqrt{\sum_{i=1}^N (X_i - \bar{X})^2} \sqrt{\sum_{i=1}^N (Y_i - \bar{Y})^2}}$$

두 벡터 $\mathbf{a}$와 $\mathbf{b}$를 $\mathbb{R}^N$ 공간에서 다음과 같이 정의합니다:

$$
\mathbf{a} = \begin{pmatrix} X_1 - \bar{X} \\ X_2 - \bar{X} \\ \vdots \\ X_N - \bar{X} \end{pmatrix}, \quad
\mathbf{b} = \begin{pmatrix} Y_1 - \bar{Y} \\ Y_2 - \bar{Y} \\ \vdots \\ Y_N - \bar{Y} \end{pmatrix}
$$

그러면 $r_{XY}$의 각 항은 벡터 연산으로 표현될 수 있습니다:
- **분자 (Numerator)**: $\mathbf{a} \cdot \mathbf{b} = \sum (X_i - \bar{X})(Y_i - \bar{Y})$ (내적)
- **분모 (Denominator)**: $\|\mathbf{a}\| \|\mathbf{b}\| = \sqrt{\sum (X_i - \bar{X})^2} \sqrt{\sum (Y_i - \bar{Y})^2}$ (노름의 곱)

따라서,
$$r_{XY} = \frac{\mathbf{a} \cdot \mathbf{b}}{\|\mathbf{a}\| \|\mathbf{b}\|}$$

### 코시-슈바르츠 부등식 (Cauchy-Schwarz Inequality)
임의의 벡터 $\mathbf{a}, \mathbf{b} \in \mathbb{R}^N$에 대해:
$$|\mathbf{a} \cdot \mathbf{b}| \le \|\mathbf{a}\| \|\mathbf{b}\|$$

양변을 $\|\mathbf{a}\| \|\mathbf{b}\|$로 나누면 (분산이 0이 아니라고 가정):
$$\frac{|\mathbf{a} \cdot \mathbf{b}|}{\|\mathbf{a}\| \|\mathbf{b}\|} \le 1 \implies |r_{XY}| \le 1$$

그러므로,
$$-1 \le r_{XY} \le 1$$
**(증명 종료)**

---

## 2. 등호 성립 조건

언제 $|r_{XY}| = 1$이 될까요?

코시-슈바르츠 부등식에서 등호가 성립할 필요충분조건은 두 벡터 $\mathbf{a}$와 $\mathbf{b}$가 **선형 종속(linearly dependent)**일 때입니다. 즉, 한 벡터가 다른 벡터의 스칼라배여야 합니다:

$$\mathbf{b} = c \mathbf{a} \quad (\text{단, } c \neq 0 \text{ 인 상수})$$

성분을 대입하면:
$$Y_i - \bar{Y} = c (X_i - \bar{X})$$

$Y_i$에 대해 정리하면:
$$Y_i = c X_i + (\bar{Y} - c\bar{X})$$

이것은 **직선의 방정식** ($Y = cX + \text{절편}$)입니다.

### Case 1: $r_{XY} = 1$
- $\mathbf{a} \cdot \mathbf{b} = \|\mathbf{a}\| \|\mathbf{b}\|$ (내적이 양수)여야 합니다.
- 이는 $c > 0$임을 의미합니다.
- **해석**: 모든 데이터 점 $(X_i, Y_i)$가 **양의 기울기**를 가진 직선 위에 완벽하게 위치합니다.

### Case 2: $r_{XY} = -1$
- $\mathbf{a} \cdot \mathbf{b} = -\|\mathbf{a}\| \|\mathbf{b}\|$ (내적이 음수)여야 합니다.
- 이는 $c < 0$임을 의미합니다.
- **해석**: 모든 데이터 점 $(X_i, Y_i)$가 **음의 기울기**를 가진 직선 위에 완벽하게 위치합니다.

---

## 3. 기하학적 의미 (Lecture 3 내용)

| 상관계수 | 조건 | 기하학적 의미 |
|---|---|---|
| **$r = 1$** | $\mathbf{b} = c\mathbf{a}, c > 0$ | 완벽한 양의 선형 관계 (직선 일치) |
| **$r = -1$** | $\mathbf{b} = c\mathbf{a}, c < 0$ | 완벽한 음의 선형 관계 (직선 일치) |
| **$|r| < 1$** | $\mathbf{a}, \mathbf{b}$가 평행하지 않음 | 산점도가 직선 주변에 흩어져 있음 |

벡터 사이의 각도 $\theta$를 이용하면:
$$r_{XY} = \cos \theta$$

- $r=1 \iff \theta = 0^\circ$ (두 벡터가 같은 방향으로 평행)
- $r=-1 \iff \theta = 180^\circ$ (두 벡터가 반대 방향으로 평행)
- $r=0 \iff \theta = 90^\circ$ (두 벡터가 직교 / 상관관계 없음)
