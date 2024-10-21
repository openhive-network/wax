#include <string>
#include <type_traits>

#include <set>
#include <vector>

struct object_node {
  inline static std::string name{ "object" };
};
struct array_node {
  inline static std::string name{ "array" };
};
struct scalar_node {
  inline static std::string name{ "scalar" };
};

template< typename T, bool is_scalar = std::is_scalar<T>::value >
struct node_type
{
  using type = T;
  using node = object_node;
};

/** Specialization to be used for all scalar types instead of specific types
*/
template <typename TScalarType>
struct node_type<TScalarType, true>
{
  using type = TScalarType;
  using node = scalar_node;
};

/** Specialization for std containers should also take other template arguments
*/
template <typename T, typename ...A>
struct node_type<std::vector<T, A...>, false>
{
  using type = T;
  using node = array_node;
};

template <typename T, typename ...A>
struct node_type<std::set<T, A...>, false>
{
  using type = T;
  using node = array_node;
};

static_assert(std::is_same<node_type<bool>::node, scalar_node>::value);

static_assert(std::is_same<node_type<std::vector<bool>>::node, array_node>::value);
static_assert(std::is_same<node_type<std::vector<bool, std::allocator<bool>>>::node, array_node>::value);
static_assert(std::is_same<node_type<std::set<int, std::less<int>, std::allocator<int>>>::node, array_node>::value);

template< typename T, typename NodeClass = typename node_type<T>::node >
struct stringifier
{
  // Not needed here: even this version of stringifier will be instantiated, it does not have strinfify method, so build fail
  //static_assert(false, "Given type is not supported by binary view stringifier");
};

/** The benefit of introducing node class is a possibility to create implementation only for them instead of every supported type
*/
template < typename T >
struct stringifier<T, scalar_node>
{
  static std::string stringify(T v)
  {
    return std::to_string(v);
  }

};

/// dedicated spec. just to print true/false instead of 0/1
template <>
struct stringifier<bool, scalar_node>
{
  inline static std::string TRUE_STR{ "true" };
  inline static std::string FALSE_STR{ "false" };

  static std::string stringify(bool v)
  {
    return v ? TRUE_STR : FALSE_STR;
  }

};

template < typename T >
struct stringifier<T, array_node>
{
  static std::string stringify(const T& v)
  {
    return "Length: " + std::to_string(v.size());
  }
};

template < typename T >
struct stringifier<T, object_node>
{
  static std::string stringify(const T& v)
  {
    return std::string{};
  }

};

/** template function allows to use implicit template argument deduction
*/
template < typename T>
inline std::string stringify(const T& v)
{
  return stringifier<T>::stringify(v);
}

#include <iostream>

int main()
{
  std::cout << stringify(false) << std::endl;
  std::cout << stringify(100) << std::endl;
  std::vector<int> x;
  std::cout << stringify(x) << std::endl;

  return 0;
}
