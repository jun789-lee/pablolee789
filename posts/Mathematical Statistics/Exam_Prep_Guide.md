# 기말 시험 대비 완벽 가이드

이 가이드는 교수님이 제시하신 **세 가지 핵심 유형**에 대한 상세 해설입니다. 증명 과정을 생략 없이 모두 포함하였으므로, 단계별로 따라가며 숙련도를 높이시길 바랍니다.

---

## 목차
1. [Type 1: 이산형 숙련도 확인 (포아송 분포)](#type-1-이산형-숙련도-확인)
2. [Type 2: 연속형 숙련도 확인 (이변량 정규분포)](#type-2-연속형-숙련도-확인)
3. [Type 3: 회귀분석과 다변량 CLT 응용](#type-3-회귀분석과-다변량-clt-응용)

---

## Type 1: 이산형 숙련도 확인

**문제 상황:**
$X \sim \text{Poisson}(\lambda_1)$, $Y \sim \text{Poisson}(\lambda_2)$이고 서로 독립일 때, $Z = X+Y$라고 하자.
다음 단계들을 증명하라.
1. $Z$의 분포 유도
2. $X|Z=z$의 조건부 확률함수 (이항분포임일 보이기)
3. $E[X|Z=z]$ 계산
4. 반복기대값 공식 $E[E[X|Z]] = E[X]$ 검증

### 1. Z의 분포 유도

두 포아송 변수의 합은 포아송 분포를 따릅니다. 이를 MGF(적률생성함수)로 증명합니다.

- **포아송 MGF:** $M_X(t) = e^{\lambda_1(e^t-1)}$, $M_Y(t) = e^{\lambda_2(e^t-1)}$
- **독립성 이용:**
$$
\begin{aligned}
M_Z(t) &= E[e^{t(X+Y)}] = E[e^{tX}]E[e^{tY}] \\
&= e^{\lambda_1(e^t-1)} \cdot e^{\lambda_2(e^t-1)} \\
&= e^{(\lambda_1+\lambda_2)(e^t-1)}
\end{aligned}
$$
- **결론:** 이것은 모수가 $\lambda_1+\lambda_2$인 포아송 분포의 MGF이므로,
  $$Z \sim \text{Poisson}(\lambda_1 + \lambda_2)$$

### 2. 조건부 확률함수 $P(X=x | Z=z)$

$$P(X=x | Z=z) = \frac{P(X=x, Z=z)}{P(Z=z)}$$

여기서 $Z=z$이면서 $X=x$라는 것은, $X=x$이고 $Y=z-x$라는 것과 같습니다. (단, $0 \le x \le z$)

$$
\begin{aligned}
P(X=x, Z=z) &= P(X=x, Y=z-x) \\
&= P(X=x)P(Y=z-x) \quad (\because \text{독립}) \\
&= \frac{\lambda_1^x e^{-\lambda_1}}{x!} \cdot \frac{\lambda_2^{z-x} e^{-\lambda_2}}{(z-x)!}
\end{aligned}
$$

이제 분모 $P(Z=z)$로 나눕니다:

$$
\begin{aligned}
P(X=x | Z=z) &= \frac{\frac{\lambda_1^x e^{-\lambda_1}}{x!} \cdot \frac{\lambda_2^{z-x} e^{-\lambda_2}}{(z-x)!}}{\frac{(\lambda_1+\lambda_2)^z e^{-(\lambda_1+\lambda_2)}}{z!}} \\
&= \frac{z!}{x!(z-x)!} \cdot \frac{\lambda_1^x \lambda_2^{z-x}}{(\lambda_1+\lambda_2)^z} \cdot \frac{e^{-(\lambda_1+\lambda_2)}}{e^{-(\lambda_1+\lambda_2)}} \\
&= \binom{z}{x} \cdot \frac{\lambda_1^x}{(\lambda_1+\lambda_2)^x} \cdot \frac{\lambda_2^{z-x}}{(\lambda_1+\lambda_2)^{z-x}} \\
&= \binom{z}{x} \left( \frac{\lambda_1}{\lambda_1+\lambda_2} \right)^x \left( \frac{\lambda_2}{\lambda_1+\lambda_2} \right)^{z-x}
\end{aligned}
$$

$p = \frac{\lambda_1}{\lambda_1+\lambda_2}$라고 두면, 이것은 **이항분포 $B(z, p)$의 확률질량함수(PMF)**입니다.
$$X | Z=z \sim \text{Binomial}\left(z, \frac{\lambda_1}{\lambda_1+\lambda_2}\right)$$

### 3. 조건부 기대값 $E[X|Z=z]$

이항분포 $B(n, p)$의 평균은 $np$이므로:
$$E[X|Z=z] = z \cdot p = z \cdot \frac{\lambda_1}{\lambda_1+\lambda_2}$$

이를 확률변수 $E[X|Z]$로 쓰면:
$$E[X|Z] = Z \cdot \frac{\lambda_1}{\lambda_1+\lambda_2}$$

### 4. 반복기대값 공식 검증

$$
\begin{aligned}
E[E[X|Z]] &= E\left[ Z \cdot \frac{\lambda_1}{\lambda_1+\lambda_2} \right] \\
&= \frac{\lambda_1}{\lambda_1+\lambda_2} E[Z] \\
&= \frac{\lambda_1}{\lambda_1+\lambda_2} (\lambda_1 + \lambda_2) \quad (\because E[Z] = \lambda_1+\lambda_2) \\
&= \lambda_1 \\
&= E[X] \quad (\text{검증 완료!})
\end{aligned}
$$

---

## Type 2: 연속형 숙련도 확인

**문제 상황:**
$(X, Y)$가 이변량 정규분포를 따를 때, 동시밀도함수로부터 조건부밀도함수와 조건부기대값을 유도하라.

### 1. 동시밀도함수 분해 및 평방완성

이변량 정규분포의 지수 부분($Q$)을 평방완성하여 분해합니다.
$$Q = Z_X^2 - 2\rho Z_X Z_Y + Z_Y^2 = (Z_Y - \rho Z_X)^2 + (1-\rho^2)Z_X^2$$

이를 이용해 밀도함수를 분해하면:
$$f(x,y) = f_X(x) \cdot f_{Y|X}(y|x)$$
$$= \left[ \frac{1}{\sqrt{2\pi}\sigma_X} e^{-\frac{Z_X^2}{2}} \right] \cdot \left[ \frac{1}{\sqrt{2\pi}\sigma_Y\sqrt{1-\rho^2}} e^{-\frac{(Z_Y - \rho Z_X)^2}{2(1-\rho^2)}} \right]$$

### 2. 조건부 분포 유도

뒤쪽 항인 조건부 밀도함수 부분을 자세히 봅니다. 이는 $Y$에 대한 정규분포 형태입니다.
지수 안쪽 부분을 정리하면:

$$\frac{(Z_Y - \rho Z_X)^2}{1-\rho^2} = \frac{\left( \frac{y-\mu_Y}{\sigma_Y} - \rho \frac{x-\mu_X}{\sigma_X} \right)^2}{1-\rho^2}$$

분자의 괄호 안을 통분하여 정리하면 $y$의 평균 위치에 해당하는 값을 찾을 수 있습니다.
$$\frac{1}{\sigma_Y} \left( y - \mu_Y - \rho\frac{\sigma_Y}{\sigma_X}(x-\mu_X) \right)$$

따라서 조건부 분포는:
$$Y | X=x \sim N\left( \mu_Y + \rho\frac{\sigma_Y}{\sigma_X}(x-\mu_X), \quad \sigma_Y^2(1-\rho^2) \right)$$

### 3. 조건부 기대값 (회귀함수)

위 분포의 평균이 곧 조건부 기대값입니다.
$$E[Y|X=x] = \mu_Y + \rho\frac{\sigma_Y}{\sigma_X}(x-\mu_X)$$

확률변수로 쓰면:
$$E[Y|X] = \mu_Y + \rho\frac{\sigma_Y}{\sigma_X}(X-\mu_X)$$

### 4. 반복기대값 공식 검증

$$
\begin{aligned}
E[E[Y|X]] &= E\left[ \mu_Y + \rho\frac{\sigma_Y}{\sigma_X}(X-\mu_X) \right] \\
&= \mu_Y + \rho\frac{\sigma_Y}{\sigma_X} E[X-\mu_X] \\
&= \mu_Y + \rho\frac{\sigma_Y}{\sigma_X} (E[X] - \mu_X) \\
&= \mu_Y + \rho\frac{\sigma_Y}{\sigma_X} (\mu_X - \mu_X) \\
&= \mu_Y \quad (\text{검증 완료!})
\end{aligned}
$$

---

## Type 3: 회귀분석과 다변량 CLT 응용

**문제:**
단순회귀모형 $Y_i = \alpha + \beta X_i + \varepsilon_i$에서 OLS 추정량 $\hat{\beta}$의 점근적 정규성을 **다변량 CLT를 사용하여** 유도하라.

### 1. 설정 및 확률벡터 정의

OLS 추정량 공식:
$$\hat{\beta} = \frac{\sum (X_i - \bar{X})(Y_i - \bar{Y})}{\sum (X_i - \bar{X})^2} = \frac{\frac{1}{N}\sum X_i Y_i - \bar{X}\bar{Y}}{\frac{1}{N}\sum X_i^2 - (\bar{X})^2}$$

분모와 분자에 있는 항들($\sum X_i, \sum X_i^2, \sum X_i Y_i$)을 다루기 위해 **3차원 확률벡터** $\mathbf{V}_i$를 정의합니다.

$$\mathbf{V}_i = \begin{pmatrix} X_i \\ X_i^2 \\ X_i Y_i \end{pmatrix}$$

이 벡터들의 평균 벡터 $\boldsymbol{\mu}_V$와 공분산 행렬 $\boldsymbol{\Sigma}_V$가 존재한다고 가정합니다.

### 2. 다변량 CLT 적용

$\mathbf{V}_1, \dots, \mathbf{V}_N$은 i.i.d. 이므로 다변량 CLT에 의해:
$$\sqrt{N}(\bar{\mathbf{V}}_N - \boldsymbol{\mu}_V) \xrightarrow{d} N(\mathbf{0}, \boldsymbol{\Sigma}_V)$$

여기서 $\bar{\mathbf{V}}_N = \begin{pmatrix} \bar{X} \\ \overline{X^2} \\ \overline{XY} \end{pmatrix}$ 입니다.

### 3. $\hat{\beta}$를 함수 $g(\bar{\mathbf{V}}_N)$으로 표현

$\hat{\beta}$는 표본평균들의 함수입니다:
$$\hat{\beta} = g(\bar{X}, \overline{X^2}, \overline{XY}) = \frac{\overline{XY} - \bar{X}\bar{Y}}{\overline{X^2} - (\bar{X})^2}$$

단, $\bar{Y}$는 여기서 제외하고, $\alpha, \beta$의 참값을 이용하여 $Y_i = \alpha + \beta X_i + \varepsilon_i$ 대입을 통해 더 간단히 보일 수도 있습니다. 수업에서는 주로 **공분산 행렬의 구조를 이용**하는 방식을 썼을 것입니다.

**더 간단한 접근 (수업 방식 유력):**
$\hat{\beta} - \beta$를 정리하면:
$$\hat{\beta} - \beta = \frac{\sum (X_i - \bar{X})\varepsilon_i}{\sum (X_i - \bar{X})^2}$$

분모는 $N \to \infty$일 때 $s_X^2 \xrightarrow{p} \sigma_X^2$ (일치성)
분자를 다룹니다:
$$\frac{1}{\sqrt{N}} \sum (X_i - \bar{X})\varepsilon_i = \frac{1}{\sqrt{N}} \sum X_i \varepsilon_i - \bar{X} \frac{1}{\sqrt{N}} \sum \varepsilon_i$$

여기서 2차원 벡터 $\mathbf{W}_i = \begin{pmatrix} X_i \varepsilon_i \\ \varepsilon_i \end{pmatrix}$ 에 대해 다변량 CLT를 적용합니다.

$$E[\mathbf{W}_i] = \begin{pmatrix} E[X_i \varepsilon_i] \\ E[\varepsilon_i] \end{pmatrix} = \begin{pmatrix} 0 \\ 0 \end{pmatrix}$$
($\because E[\varepsilon|X]=0 \implies E[X\varepsilon]=0$)

공분산 행렬 $\boldsymbol{\Sigma}_W$:
$$\boldsymbol{\Sigma}_W = E[\mathbf{W}_i \mathbf{W}_i^T] = \begin{pmatrix} E[X_i^2 \varepsilon_i^2] & E[X_i \varepsilon_i^2] \\ E[X_i \varepsilon_i^2] & E[\varepsilon_i^2] \end{pmatrix} = \sigma_\varepsilon^2 \begin{pmatrix} E[X^2] & E[X] \\ E[X] & 1 \end{pmatrix}$$
(가정: $\text{Var}(\varepsilon|X) = \sigma_\varepsilon^2$ 등분산성)

### 4. 최종 분포 유도

다변량 CLT에 의해 분자의 합 부분은 정규분포로 수렴합니다.
결과적으로 슬러츠키 정리 등을 종합하면:

$$\sqrt{N}(\hat{\beta} - \beta) \xrightarrow{d} N\left(0, \frac{\sigma_\varepsilon^2}{\text{Var}(X)}\right)$$

**핵심 포인트:**
1. **문제 정의:** $\hat{\beta}$ 식을 $\varepsilon$ 포함 형태로 변형
2. **CLT 적용 대상:** $\sum X_i \varepsilon_i$ 같은 합 항에 다변량 CLT 적용
3. **분산 계산:** 공분산 행렬을 통해 최종 분산 유도

> **시험 팁:** 위 3가지 단계를 명확히 서술하는 것이 중요합니다.
