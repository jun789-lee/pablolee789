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
단순회귀모형 $Y_i = \alpha + \beta X_i + \varepsilon_i$에서 OLS 추정량 $\hat{\beta}$에 대해, $\sqrt{N}(\hat{\beta} - \beta)$의 극한 분포를 **다변량 중심극한정리(Multivariate CLT)를 사용하여** 유도하라.

---

### **[Step 1] 추정량 $\hat{\beta}$의 변형**

먼저 OLS 추정량 공식은 다음과 같습니다.
$$ \hat{\beta} = \frac{\sum_{i=1}^{N}(X_i - \bar{X})(Y_i - \bar{Y})}{\sum_{i=1}^{N}(X_i - \bar{X})^2} $$

이 식에 $Y_i = \alpha + \beta X_i + \varepsilon_i$를 대입하여 오차항에 대한 식으로 변형합니다.

1. **모델 대입 및 $\bar{Y}$ 계산**
   $$ Y_i = \alpha + \beta X_i + \varepsilon_i $$
   $$ \bar{Y} = \alpha + \beta \bar{X} + \bar{\varepsilon} $$

2. **$Y_i - \bar{Y}$ 정리**
   $$Y_i - \bar{Y} = (\alpha - \alpha) + \beta(X_i - \bar{X}) + (\varepsilon_i - \bar{\varepsilon}) = \beta(X_i - \bar{X}) + (\varepsilon_i - \bar{\varepsilon})$$

3. **분자에 대입하여 전개**
   $$ \sum (X_i - \bar{X})(Y_i - \bar{Y}) = \beta \sum (X_i - \bar{X})^2 + \sum (X_i - \bar{X})\varepsilon_i $$
   *(참고: $\sum (X_i - \bar{X})\bar{\varepsilon} = 0$ 이므로 사라짐)*

4. **최종 정리**
   $$ \hat{\beta} = \beta + \frac{\sum (X_i - \bar{X})\varepsilon_i}{\sum (X_i - \bar{X})^2} \implies \hat{\beta} - \beta = \frac{\sum (X_i - \bar{X})\varepsilon_i}{\sum (X_i - \bar{X})^2} $$

따라서 양변에 $\sqrt{N}$을 곱하면 오차항 $\varepsilon$에 대한 식이 됩니다:
$$
\sqrt{N}(\hat{\beta} - \beta) = \frac{\frac{1}{\sqrt{N}}\sum_{i=1}^{N}(X_i - \bar{X})\varepsilon_i}{\frac{1}{N}\sum_{i=1}^{N}(X_i - \bar{X})^2}
$$

---

### **[Step 2] 분자에 다변량 CLT 적용 (핵심)**

분자의 핵심 부분인 $\sum (X_i - \bar{X})\varepsilon_i$를 다루기 위해, **2차원 확률벡터 $\mathbf{W}_i$**를 다음과 같이 정의합니다. (교수님 강의 노트 방식)

$$
\mathbf{W}_i = \begin{pmatrix} X_i \varepsilon_i \\ \varepsilon_i \end{pmatrix}
$$

이 벡터의 기댓값과 분산 행렬을 구합니다.

**1. 기댓값 벡터 $E[\mathbf{W}_i]$**
- $E[\varepsilon_i] = 0$
- $E[X_i \varepsilon_i] = E_X[X_i E[\varepsilon_i|X_i]] = E_X[X_i \cdot 0] = 0$ (독립성/외생성 가정)

$$E[\mathbf{W}_i] = \mathbf{0} = \begin{pmatrix} 0 \\ 0 \end{pmatrix}$$

**2. 분산 행렬 $\boldsymbol{\Sigma}_W$**
$$
\begin{aligned}
\boldsymbol{\Sigma}_W &= E[\mathbf{W}_i \mathbf{W}_i^T] = E\left[ \begin{pmatrix} X_i \varepsilon_i \\ \varepsilon_i \end{pmatrix} \begin{pmatrix} X_i \varepsilon_i & \varepsilon_i \end{pmatrix} \right] \\
&= E\left[ \begin{pmatrix} X_i^2 \varepsilon_i^2 & X_i \varepsilon_i^2 \\ X_i \varepsilon_i^2 & \varepsilon_i^2 \end{pmatrix} \right]
\end{aligned}
$$

가정 $\text{Var}(\varepsilon_i|X_i) = \sigma_\varepsilon^2$ (등분산성)을 이용하면:
- $E[X_i^2 \varepsilon_i^2] = E[X_i^2] E[\varepsilon_i^2] = E[X^2] \sigma_\varepsilon^2$
- $E[X_i \varepsilon_i^2] = E[X_i] E[\varepsilon_i^2] = \mu_X \sigma_\varepsilon^2$
- $E[\varepsilon_i^2] = \sigma_\varepsilon^2$

$$
\boldsymbol{\Sigma}_W = \sigma_\varepsilon^2 \begin{pmatrix} E[X^2] & \mu_X \\ \mu_X & 1 \end{pmatrix}
$$

**3. 다변량 CLT 적용**
$\mathbf{W}_1, \dots, \mathbf{W}_N$은 서로 독립이므로, 다변량 CLT에 의해:

$$
\sqrt{N}\left( \bar{\mathbf{W}}_N - \mathbf{0} \right) = \begin{pmatrix} \frac{1}{\sqrt{N}}\sum X_i \varepsilon_i \\ \frac{1}{\sqrt{N}}\sum \varepsilon_i \end{pmatrix} \xrightarrow{d} N(\mathbf{0}, \boldsymbol{\Sigma}_W)
$$

우리가 필요한 분자 식은 이 벡터의 선형 결합입니다:
$$
\frac{1}{\sqrt{N}}\sum (X_i - \bar{X})\varepsilon_i = \frac{1}{\sqrt{N}}\sum X_i \varepsilon_i - \bar{X} \left( \frac{1}{\sqrt{N}}\sum \varepsilon_i \right)
$$

여기서 $\bar{X} \xrightarrow{p} \mu_X$ (대수의 법칙) 이므로, **슬러츠키 정리(Slutsky's Theorem)**에 의해 확률변수들의 선형 결합으로 취급할 수 있습니다.

$$ Z \approx \left(\frac{1}{\sqrt{N}}\sum X_i \varepsilon_i\right) - \mu_X \left( \frac{1}{\sqrt{N}}\sum \varepsilon_i \right) $$

이 식의 분산을 계산하면 ($\text{Var}(A - bB) = \text{Var}(A) + b^2\text{Var}(B) - 2b\text{Cov}(A,B)$ 공식 활용):

$$
\begin{aligned}
\text{Var}(\text{분자}) &= \text{Var}\left( \frac{1}{\sqrt{N}}\sum X_i \varepsilon_i \right) + \mu_X^2 \text{Var}\left( \frac{1}{\sqrt{N}}\sum \varepsilon_i \right) - 2\mu_X \text{Cov}\left( \frac{1}{\sqrt{N}}\sum X_i \varepsilon_i, \frac{1}{\sqrt{N}}\sum \varepsilon_i \right) \\
&= (\sigma_\varepsilon^2 E[X^2]) + \mu_X^2 (\sigma_\varepsilon^2 \cdot 1) - 2\mu_X (\sigma_\varepsilon^2 \mu_X) \\
&= \sigma_\varepsilon^2 (E[X^2] + \mu_X^2 - 2\mu_X^2) \\
&= \sigma_\varepsilon^2 (E[X^2] - \mu_X^2) \\
&= \sigma_\varepsilon^2 \text{Var}(X)
\end{aligned}
$$

즉, 분자는 다음 분포로 수렴합니다:
$$
\frac{1}{\sqrt{N}}\sum (X_i - \bar{X})\varepsilon_i \xrightarrow{d} N(0, \sigma_\varepsilon^2 \sigma_X^2)
$$

---

### **[Step 3] 최종 분포 유도 (Slutsky's Theorem)**

이제 원래 식을 다시 봅니다.

$$
\sqrt{N}(\hat{\beta} - \beta) = \frac{\text{분자}}{\text{분모}} = \frac{\frac{1}{\sqrt{N}}\sum(X_i - \bar{X})\varepsilon_i}{\frac{1}{N}\sum(X_i - \bar{X})^2}
$$

**1. 분모의 수렴**
대수의 법칙(LLN)에 의해 표본분산은 모분산으로 수렴합니다.
$$
\frac{1}{N}\sum (X_i - \bar{X})^2 \xrightarrow{p} \text{Var}(X) = \sigma_X^2
$$

**2. 전체 식의 수렴**
슬러츠키 정리에 의해, (확률수렴하는 분모) 분의 (분포수렴하는 분자)는 정규분포를 따릅니다.

$$
\sqrt{N}(\hat{\beta} - \beta) \xrightarrow{d} \frac{1}{\sigma_X^2} \cdot N(0, \sigma_\varepsilon^2 \sigma_X^2)
$$

분산 계산:
$$
\text{Var}(\text{전체}) = \left( \frac{1}{\sigma_X^2} \right)^2 \cdot (\sigma_\varepsilon^2 \sigma_X^2) = \frac{\sigma_\varepsilon^2}{\sigma_X^2}
$$

### **[결론]**

$$
\boxed{\sqrt{N}(\hat{\beta} - \beta) \xrightarrow{d} N\left(0, \frac{\sigma_\varepsilon^2}{\sigma_X^2}\right)}
$$

> **참고:** 이 결과는 오차항 $\varepsilon$의 정규성 가정 없이도, **표본 크기 N이 클 때** $\hat{\beta}$가 정규분포를 따른다는 사실을 보여줍니다.
