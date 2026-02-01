# 제9회 다변량 정규분포의 모멘트 생성함수

## 1. 복습: 표준정규분포 2개

### 설정
$$Z_1 \sim N(0,1), \quad Z_2 \sim N(0,1), \quad Z_1 \perp Z_2$$

### 동시밀도함수
$$f(z_1, z_2) = \phi(z_1)\phi(z_2) = \frac{1}{2\pi}e^{-\frac{z_1^2 + z_2^2}{2}}$$

---

## 2. 선형변환으로 이변량 정규분포 생성

### 변환
$$\mathbf{X} = A\mathbf{Z} + \boldsymbol{\mu}$$

여기서:
- $\mathbf{Z} = (Z_1, Z_2)^T$: 독립 표준정규
- $A$: 2×2 행렬
- $\boldsymbol{\mu}$: 평균 벡터

### 결과
$$\mathbf{X} \sim N(\boldsymbol{\mu}, \boldsymbol{\Sigma})$$

$$\boldsymbol{\Sigma} = AA^T$$

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

### 이 경우의 야코비안
$$|J| = |B| = |A^{-1}| = \frac{1}{|A|}$$

### 행렬식의 성질
$$|AA^T| = |A|^2$$
$$|\boldsymbol{\Sigma}| = |AA^T| = |A|^2$$
$$|A| = |\boldsymbol{\Sigma}|^{1/2}$$

---

## 5. 이변량 정규분포의 밀도함수

$$f_X(\mathbf{x}) = \frac{1}{2\pi|\boldsymbol{\Sigma}|^{1/2}} \exp\left(-\frac{1}{2}(\mathbf{x}-\boldsymbol{\mu})^T \boldsymbol{\Sigma}^{-1} (\mathbf{x}-\boldsymbol{\mu})\right)$$

### 지수 부분 정리
$$(\mathbf{x}-\boldsymbol{\mu})^T \boldsymbol{\Sigma}^{-1} (\mathbf{x}-\boldsymbol{\mu})$$

$B = A^{-1}$, $\boldsymbol{\Sigma}^{-1} = (AA^T)^{-1} = (A^T)^{-1}A^{-1} = B^T B$ 이므로:

$$= (\mathbf{x}-\boldsymbol{\mu})^T B^T B (\mathbf{x}-\boldsymbol{\mu}) = \mathbf{z}^T \mathbf{z} = z_1^2 + z_2^2$$

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

### 정의
$$M_X(t) = E[e^{tX}]$$

### X ~ N(μ, σ²) 일 때
$$M_X(t) = \exp\left(\mu t + \frac{1}{2}\sigma^2 t^2\right)$$

### 유도 (표준정규에서)
$$Z \sim N(0,1)$$
$$M_Z(t) = \int_{-\infty}^{\infty} \frac{1}{\sqrt{2\pi}} e^{tz} e^{-\frac{z^2}{2}} dz$$

평방완성:
$$= \int \frac{1}{\sqrt{2\pi}} e^{-\frac{(z-t)^2}{2} + \frac{t^2}{2}} dz = e^{\frac{t^2}{2}}$$

---

## 8. 이변량 정규분포의 MGF

### 정의
$$M_{\mathbf{X}}(\mathbf{t}) = E[e^{\mathbf{t}^T \mathbf{X}}] = E[e^{t_1 X_1 + t_2 X_2}]$$

여기서 $\mathbf{t} = (t_1, t_2)^T$

### 유도
$$X = AZ + \mu$$

$$M_{\mathbf{X}}(\mathbf{t}) = E[e^{\mathbf{t}^T (A\mathbf{Z} + \boldsymbol{\mu})}]$$
$$= e^{\mathbf{t}^T \boldsymbol{\mu}} E[e^{\mathbf{t}^T A \mathbf{Z}}]$$

$\mathbf{s} = A^T \mathbf{t}$ 로 두면:
$$= e^{\mathbf{t}^T \boldsymbol{\mu}} E[e^{s_1 Z_1 + s_2 Z_2}]$$
$$= e^{\mathbf{t}^T \boldsymbol{\mu}} E[e^{s_1 Z_1}] E[e^{s_2 Z_2}]$$ (독립)
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
