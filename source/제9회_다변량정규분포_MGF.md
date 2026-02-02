# 제9회 다변량 정규분포의 모멘트 생성함수

## 1. 복습: 표준정규분포 2개

### 설정
$$Z_1 \sim N(0,1), \quad Z_2 \sim N(0,1), \quad Z_1 \perp Z_2$$

### 동시밀도함수
$$f(z_1, z_2) = \phi(z_1)\phi(z_2) = \frac{1}{2\pi}e^{-\frac{z_1^2 + z_2^2}{2}}$$

**$\phi$ (phi) 표기법:**

| 기호 | 이름 | 의미 |
|------|------|------|
| $\phi(z)$ | PDF | 표준정규분포의 확률밀도함수: $\frac{1}{\sqrt{2\pi}} e^{-\frac{z^2}{2}}$ |
| $\Phi(z)$ | CDF | 표준정규분포의 누적분포함수: $P(Z \leq z)$ |

독립인 두 표준정규분포의 **동시밀도** = 각각의 PDF를 곱한 것!

---

## 2. 선형변환으로 이변량 정규분포 생성

### 왜 선형변환을 하는가?

**실용적 목적: 상관관계 있는 난수 생성!**
- 독립인 표준정규 $Z_1, Z_2$는 Box-Muller로 쉽게 생성
- 하지만 실제로는 **상관관계 있는** 정규분포가 필요 (예: 키와 몸무게)
- 선형변환으로 **상관관계를 주입**!

```
독립 표준정규 Z₁, Z₂ (쉽게 생성 가능)
         ↓ 선형변환 X = AZ + μ
상관관계 있는 정규분포 X₁, X₂
```

### 변환 (벡터 표기)
$$\mathbf{X} = A\mathbf{Z} + \boldsymbol{\mu}$$

풀어쓰면:
$$\begin{pmatrix} X_1 \\ X_2 \end{pmatrix} = \begin{pmatrix} a_{11} & a_{12} \\ a_{21} & a_{22} \end{pmatrix} \begin{pmatrix} Z_1 \\ Z_2 \end{pmatrix} + \begin{pmatrix} \mu_1 \\ \mu_2 \end{pmatrix}$$

여기서:
- $\mathbf{Z} = (Z_1, Z_2)^T$: 독립 표준정규
- $A$: 2×2 행렬 (상관관계를 결정!)
- $\boldsymbol{\mu}$: 평균 벡터

### 어떻게 상관관계가 생기나?

풀어쓰면:
- $X_1 = a_{11}Z_1 + a_{12}Z_2 + \mu_1$
- $X_2 = a_{21}Z_1 + a_{22}Z_2 + \mu_2$

**핵심:** $X_1$과 $X_2$가 **같은 $Z_1$, $Z_2$를 공유**하기 때문에 상관관계 발생!

예시:
- $a_{12} \neq 0$이면 → $X_1$에도 $Z_2$가 섞임
- $a_{21} \neq 0$이면 → $X_2$에도 $Z_1$이 섞임
- 같은 재료($Z$)를 공유 → **상관관계!**

### 결과
$$\mathbf{X} \sim N(\boldsymbol{\mu}, \boldsymbol{\Sigma})$$

$$\boldsymbol{\Sigma} = AA^T$$

### 왜 $\boldsymbol{\Sigma} = AA^T$인가? (유도)

**공분산 행렬의 정의:**
$$\boldsymbol{\Sigma} = \text{Cov}(\mathbf{X}) = E[(\mathbf{X} - \boldsymbol{\mu})(\mathbf{X} - \boldsymbol{\mu})^T]$$

**Step 1:** $\mathbf{X} - \boldsymbol{\mu} = A\mathbf{Z}$

**Step 2:** 공분산 정의에 대입
$$\boldsymbol{\Sigma} = E[(A\mathbf{Z})(A\mathbf{Z})^T] = E[A\mathbf{Z}\mathbf{Z}^T A^T]$$

**Step 3:** $A$는 상수 행렬이므로 기댓값 밖으로
$$= A \cdot E[\mathbf{Z}\mathbf{Z}^T] \cdot A^T$$

**Step 4:** $\mathbf{Z}$는 독립 표준정규이므로
$$E[\mathbf{Z}\mathbf{Z}^T] = I$$
- $E[Z_1^2] = 1$, $E[Z_2^2] = 1$ (분산이 1)
- $E[Z_1 Z_2] = 0$ (독립 → 공분산 0)

**Step 5:** 최종 결과
$$\boldsymbol{\Sigma} = A \cdot I \cdot A^T = AA^T$$

> 행렬 $A$가 공분산 구조를 결정한다!

---

## 3. 역변환

### X에서 Z로
$$\mathbf{Z} = A^{-1}(\mathbf{X} - \boldsymbol{\mu}) = B(\mathbf{X} - \boldsymbol{\mu})$$

여기서 $B = A^{-1}$

### 조건
- A가 **가역** (역행렬 존재)
- $|A| \neq 0$ (비특이 행렬)

---

## 4. 야코비안

### 변수변환 공식
$$f_X(\mathbf{x}) = f_Z(\mathbf{z}) \cdot |J|$$

### 왜 야코비안이 $B$인가?

**역변환을 풀어쓰면:**
$$z_1 = b_{11}(x_1 - \mu_1) + b_{12}(x_2 - \mu_2)$$
$$z_2 = b_{21}(x_1 - \mu_1) + b_{22}(x_2 - \mu_2)$$

**야코비안 정의:**
$$J = \begin{pmatrix} \frac{\partial z_1}{\partial x_1} & \frac{\partial z_1}{\partial x_2} \\ \frac{\partial z_2}{\partial x_1} & \frac{\partial z_2}{\partial x_2} \end{pmatrix}$$

**편미분 계산:**
$$\frac{\partial z_1}{\partial x_1} = b_{11}, \quad \frac{\partial z_1}{\partial x_2} = b_{12}$$
$$\frac{\partial z_2}{\partial x_1} = b_{21}, \quad \frac{\partial z_2}{\partial x_2} = b_{22}$$

**결과:**
$$J = \begin{pmatrix} b_{11} & b_{12} \\ b_{21} & b_{22} \end{pmatrix} = B = A^{-1}$$

> **핵심:** 선형변환의 야코비안은 그냥 **계수 행렬** 자체!

### 이 경우의 야코비안
$$|J| = |B| = |A^{-1}| = \frac{1}{|A|}$$

### 행렬식의 성질

**기본 성질 (외우기!):**
1. $|AB| = |A| \cdot |B|$ (곱의 행렬식 = 행렬식의 곱)
2. $|A^T| = |A|$ (전치해도 행렬식 불변)

**유도:**
$$|AA^T| = |A| \cdot |A^T| = |A| \cdot |A| = |A|^2$$

$\boldsymbol{\Sigma} = AA^T$이므로:
$$|\boldsymbol{\Sigma}| = |AA^T| = |A|^2$$

양변에 제곱근:
$$|A| = |\boldsymbol{\Sigma}|^{1/2}$$

> 기본 성질 2개만 외우면 나머지는 자연스럽게 유도됨!

---

## 5. 이변량 정규분포의 밀도함수

$$f_X(\mathbf{x}) = \frac{1}{2\pi|\boldsymbol{\Sigma}|^{1/2}} \exp\left(-\frac{1}{2}(\mathbf{x}-\boldsymbol{\mu})^T \boldsymbol{\Sigma}^{-1} (\mathbf{x}-\boldsymbol{\mu})\right)$$

### 지수 부분 정리
$$(\mathbf{x}-\boldsymbol{\mu})^T \boldsymbol{\Sigma}^{-1} (\mathbf{x}-\boldsymbol{\mu})$$

$B = A^{-1}$, $\boldsymbol{\Sigma}^{-1} = (AA^T)^{-1} = (A^T)^{-1}A^{-1} = B^T B$ 이므로:

$$= (\mathbf{x}-\boldsymbol{\mu})^T B^T B (\mathbf{x}-\boldsymbol{\mu}) = \mathbf{z}^T \mathbf{z} = z_1^2 + z_2^2$$

### 왜 지수 부분을 정리하나?

**1️⃣ 변환의 정확성 검증**
- 결과가 $z_1^2 + z_2^2$ = **표준정규분포의 지수 부분**
- 변환이 맞다는 증거!

**2️⃣ 계산의 간소화**

| 형태 | 복잡도 |
|------|--------|
| $(\mathbf{x}-\boldsymbol{\mu})^T \boldsymbol{\Sigma}^{-1} (\mathbf{x}-\boldsymbol{\mu})$ | 복잡 (역행렬) |
| $z_1^2 + z_2^2$ | 간단! |

**3️⃣ 기하학적 의미**
- $z_1^2 + z_2^2 = r^2$ = 원점에서의 거리의 제곱
- 밀도함수가 원점에서 멀어질수록 작아짐

**왜 멀어지면 밀도가 작아지나?**

밀도함수: $f(\mathbf{z}) \propto e^{-\frac{r^2}{2}}$

| 거리 $r$ | 지수 $-\frac{r^2}{2}$ | $e^{-\frac{r^2}{2}}$ |
|----------|---------------------|---------------------|
| $r = 0$ (원점) | $0$ | $1$ (최대!) |
| $r = 1$ | $-0.5$ | $\approx 0.61$ |
| $r = 2$ | $-2$ | $\approx 0.14$ |
| $r = 3$ | $-4.5$ | $\approx 0.01$ |

$r$이 커지면 → 지수가 더 음수 → $e^{음수}$는 0에 가까워짐!

**$r$이 커진다는 것의 의미:**

$Z_1, Z_2 \sim N(0,1)$이므로 평균이 둘 다 0. 즉 "중심"은 원점 $(0, 0)$.

$$r = \sqrt{Z_1^2 + Z_2^2} = \text{원점(평균)에서의 거리}$$

| 상황 | $r$ | 밀도 | 의미 |
|------|-----|------|------|
| $Z_1 \approx 0$, $Z_2 \approx 0$ | 작음 | 높음 | **전형적인 값** (자주 나옴) |
| $Z_1 = 3$, $Z_2 = 2$ | 큼 | 낮음 | **극단적 값** (드물게 나옴) |

> **$r$ 커짐 = 평균에서 벗어남 = 극단적/드문 값 = 밀도 낮음** 🔔

> 복잡한 공분산 구조를 간단한 $z_1^2 + z_2^2$로 환원!

---

## 6. 양정치 행렬 (Positive Definite)

### 정의
$$\mathbf{u}^T \boldsymbol{\Sigma} \mathbf{u} > 0 \quad \text{for all } \mathbf{u} \neq \mathbf{0}$$

### 왜 중요한가?
- 공분산 행렬 Σ는 항상 양정치 (또는 양반정치)
- Σ가 양정치 ⟺ Σ가 가역
- Σ = AA^T 형태로 분해 가능 (콜레스키 분해)

### 증명
$$\mathbf{u}^T AA^T \mathbf{u} = (A^T \mathbf{u})^T (A^T \mathbf{u}) = \|A^T \mathbf{u}\|^2 \geq 0$$

---

## 7. 일변량 정규분포의 MGF (복습)

### MGF(모멘트 생성함수)의 목적

**1️⃣ 모멘트 쉽게 계산**

$k$번째 모멘트: $E[X^k] = M_X^{(k)}(0)$

| 미분 횟수 | 얻는 것 |
|----------|--------|
| 1차 미분 | $E[X]$ (평균) |
| 2차 미분 | $E[X^2]$ → 분산 계산 |
| n차 미분 | $E[X^n]$ (n차 모멘트) |

**2️⃣ 분포 식별 (Uniqueness)**

> MGF가 같으면 → 분포가 같다!

**3️⃣ 합의 분포 쉽게 계산**

독립인 $X, Y$에 대해: $M_{X+Y}(t) = M_X(t) \cdot M_Y(t)$

적분 없이 **곱셈**만으로 합의 분포를 구할 수 있음!

### 정의
$$M_X(t) = E[e^{tX}]$$

($e^{tX}$이지, $e^{tX^2}$이 아님에 주의!)

### 왜 미분하면 모멘트가 나오나? (테일러 전개)

**$e^{tX}$를 전개:**
$$e^{tX} = 1 + tX + \frac{(tX)^2}{2!} + \frac{(tX)^3}{3!} + \cdots$$

**기댓값 취하면:**
$$M_X(t) = 1 + tE[X] + \frac{t^2}{2!}E[X^2] + \frac{t^3}{3!}E[X^3] + \cdots$$

**1차 미분:**
$$M_X'(t) = E[X] + tE[X^2] + \frac{t^2}{2!}E[X^3] + \cdots$$

**$t=0$ 대입:**
$$M_X'(0) = E[X] \quad \text{(평균!)}$$

### 모멘트 추출 요약

| 연산 | 결과 |
|------|------|
| $M_X(0)$ | $1$ (항상) |
| $M_X'(0)$ | $E[X]$ (평균) |
| $M_X''(0)$ | $E[X^2]$ |
| $M_X^{(n)}(0)$ | $E[X^n]$ (n차 모멘트) |

### 분산 계산
$$\text{Var}(X) = E[X^2] - (E[X])^2 = M_X''(0) - (M_X'(0))^2$$

### X ~ N(μ, σ²) 일 때
$$M_X(t) = \exp\left(\mu t + \frac{1}{2}\sigma^2 t^2\right)$$

### 유도 (표준정규에서)

**기댓값의 정의 (중요!):**
$$E[g(Z)] = \int_{-\infty}^{\infty} g(z) \cdot f(z) \, dz$$

$g(z)$와 밀도함수 $f(z)$를 **곱하는 것**! (지수에 넣는 게 아님)

**MGF 적용:**
$$M_Z(t) = E[e^{tZ}] = \int_{-\infty}^{\infty} \underbrace{e^{tz}}_{g(z)} \cdot \underbrace{f(z)}_{\text{밀도함수}} \, dz$$

**표준정규분포의 밀도함수:** $f(z) = \frac{1}{\sqrt{2\pi}} e^{-\frac{z^2}{2}}$

**대입:**
$$Z \sim N(0,1)$$
$$M_Z(t) = \int_{-\infty}^{\infty} e^{tz} \cdot \frac{1}{\sqrt{2\pi}} e^{-\frac{z^2}{2}} dz$$

**Step 1: 지수 부분 합치기**
$$= \int \frac{1}{\sqrt{2\pi}} e^{tz - \frac{z^2}{2}} dz$$

**Step 2: 지수 부분 정리**
$$tz - \frac{z^2}{2} = -\frac{1}{2}(z^2 - 2tz)$$

**Step 3: 평방완성 (Completing the Square)**
$$z^2 - 2tz = (z - t)^2 - t^2$$

따라서:
$$-\frac{1}{2}(z^2 - 2tz) = -\frac{1}{2}((z-t)^2 - t^2) = -\frac{(z-t)^2}{2} + \frac{t^2}{2}$$

**Step 4: 적분에 대입**
$$M_Z(t) = \int \frac{1}{\sqrt{2\pi}} e^{-\frac{(z-t)^2}{2} + \frac{t^2}{2}} dz$$

**Step 5: 상수 $e^{\frac{t^2}{2}}$를 적분 밖으로**
$$= e^{\frac{t^2}{2}} \int \frac{1}{\sqrt{2\pi}} e^{-\frac{(z-t)^2}{2}} dz$$

**Step 6: 적분값 = 1**

$\int \frac{1}{\sqrt{2\pi}} e^{-\frac{(z-t)^2}{2}} dz$는 평균이 $t$인 정규분포의 전체 확률 = **1**

**결론:**
$$M_Z(t) = e^{\frac{t^2}{2}}$$

---

## 8. 이변량 정규분포의 MGF

### 정의
$$M_{\mathbf{X}}(\mathbf{t}) = E[e^{\mathbf{t}^T \mathbf{X}}] = E[e^{t_1 X_1 + t_2 X_2}]$$

여기서 $\mathbf{t} = (t_1, t_2)^T$

### 유도
$$X = AZ + \mu$$

$$M_{\mathbf{X}}(\mathbf{t}) = E[e^{\mathbf{t}^T (A\mathbf{Z} + \boldsymbol{\mu})}]$$
$$= e^{\mathbf{t}^T \boldsymbol{\mu}} E[e^{\mathbf{t}^T A \mathbf{Z}}]$$

**벡터 표기 규칙:**
- 벡터는 기본적으로 **세로 벡터** (열 벡터)
- $\mathbf{t} = \begin{pmatrix} t_1 \\ t_2 \end{pmatrix}$ (2×1 세로)
- $\mathbf{t}^T = (t_1, t_2)$ (1×2 가로)

**$\mathbf{s} = A^T \mathbf{t}$ 차원 분석:**
- $A^T$: 2×2
- $\mathbf{t}$: 2×1 (세로 벡터)
- $\mathbf{s} = A^T \mathbf{t}$: (2×2)·(2×1) = **2×1 세로 벡터**

**변환:**
$\mathbf{t}^T A = \mathbf{s}^T$ (전치 성질: $(A^T \mathbf{t})^T = \mathbf{t}^T A$)

따라서:
$$\mathbf{t}^T A \mathbf{Z} = \mathbf{s}^T \mathbf{Z} = s_1 Z_1 + s_2 Z_2$$

$\mathbf{s} = A^T \mathbf{t}$ 로 두면:
$$= e^{\mathbf{t}^T \boldsymbol{\mu}} E[e^{s_1 Z_1 + s_2 Z_2}]$$
$$= e^{\mathbf{t}^T \boldsymbol{\mu}} E[e^{s_1 Z_1}] E[e^{s_2 Z_2}]$$

(독립이므로 기댓값을 분리)
$$= e^{\mathbf{t}^T \boldsymbol{\mu}} e^{\frac{s_1^2}{2}} e^{\frac{s_2^2}{2}}$$
$$= e^{\mathbf{t}^T \boldsymbol{\mu}} e^{\frac{1}{2}\mathbf{s}^T \mathbf{s}}$$
$$= e^{\mathbf{t}^T \boldsymbol{\mu}} e^{\frac{1}{2}\mathbf{t}^T AA^T \mathbf{t}}$$

### 결론
$$M_{\mathbf{X}}(\mathbf{t}) = \exp\left(\mathbf{t}^T \boldsymbol{\mu} + \frac{1}{2}\mathbf{t}^T \boldsymbol{\Sigma} \mathbf{t}\right)$$

---

## 9. n변량으로 확장

### n변량 정규분포
$$\mathbf{X} \sim N_n(\boldsymbol{\mu}, \boldsymbol{\Sigma})$$

- $\boldsymbol{\mu}$: n×1 평균 벡터
- $\boldsymbol{\Sigma}$: n×n 공분산 행렬

### MGF
$$M_{\mathbf{X}}(\mathbf{t}) = \exp\left(\mathbf{t}^T \boldsymbol{\mu} + \frac{1}{2}\mathbf{t}^T \boldsymbol{\Sigma} \mathbf{t}\right)$$

> 형태가 동일! (차원만 n으로 확장)

---

## 10. 핵심 공식 정리

| 개념 | 공식 |
|---|---|
| 선형변환 | $\mathbf{X} = A\mathbf{Z} + \boldsymbol{\mu}$ |
| 공분산 행렬 | $\boldsymbol{\Sigma} = AA^T$ |
| 밀도함수 | $f \propto \exp(-\frac{1}{2}(\mathbf{x}-\boldsymbol{\mu})^T \boldsymbol{\Sigma}^{-1} (\mathbf{x}-\boldsymbol{\mu}))$ |
| MGF | $M(\mathbf{t}) = \exp(\mathbf{t}^T\boldsymbol{\mu} + \frac{1}{2}\mathbf{t}^T\boldsymbol{\Sigma}\mathbf{t})$ |

---

## 11. 이 강의의 핵심 메시지

1. **선형변환으로 정규분포 생성**
   - 독립 표준정규 Z에 행렬 A를 곱하면 상관있는 정규분포 X

2. **공분산 행렬 Σ = AA^T**
   - 변환 행렬 A가 결정하는 것

3. **MGF의 일반화**
   - 일변량: $\exp(\mu t + \frac{1}{2}\sigma^2 t^2)$
   - 다변량: $\exp(\mathbf{t}^T\boldsymbol{\mu} + \frac{1}{2}\mathbf{t}^T\boldsymbol{\Sigma}\mathbf{t})$

---

## 12. Q&A

### Q1. 왜 Σ = AA^T 인가?

$$\text{Cov}(\mathbf{X}) = \text{Cov}(A\mathbf{Z}) = A \cdot \text{Cov}(\mathbf{Z}) \cdot A^T = A I A^T = AA^T$$

### Q2. 양정치 (positive definite) 왜 필요?

- Σ가 양정치여야 **역행렬**이 존재
- 역행렬이 있어야 밀도함수의 **지수 부분** 계산 가능
- 분산이 0이면 양정치 아님 (특이 행렬)
